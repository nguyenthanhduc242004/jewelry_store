using JewelryStore.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace JewelryStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly ILogger<AuthController> _logger;
        private readonly string _spaBaseUrl;

        public AuthController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IAuthenticationSchemeProvider schemeProvider,
            ILogger<AuthController> logger,
            IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _schemeProvider = schemeProvider;
            _logger = logger;
            var allowed = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            _spaBaseUrl = allowed.FirstOrDefault() ?? "http://localhost:5173";
        }

        public record ChangePasswordDto(string CurrentPassword, string NewPassword);

        [HttpGet("google")]
        public async Task<IActionResult> GoogleLogin([FromQuery] string returnUrl = "/")
        {
            _logger.LogInformation("Starting Google login. returnUrl={ReturnUrl}", returnUrl);
            var googleScheme = await _schemeProvider.GetSchemeAsync(GoogleDefaults.AuthenticationScheme);
            if (googleScheme == null)
            {
                _logger.LogWarning("Google authentication scheme is not configured.");
                return StatusCode(501, new { error = "Google authentication is not configured on the server." });
            }
            var callback = Url.ActionLink(nameof(ExternalLoginCallback), "Auth", new { returnUrl }) ?? "/api/auth/external-callback";
            var props = _signInManager.ConfigureExternalAuthenticationProperties(GoogleDefaults.AuthenticationScheme, callback);
            _logger.LogInformation("Redirecting to Google. callback={Callback}", callback);
            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("external-callback")]
        public async Task<IActionResult> ExternalLoginCallback([FromQuery] string returnUrl = "/")
        {
            _logger.LogInformation("ExternalLoginCallback invoked. returnUrl={ReturnUrl}", returnUrl);
            var googleScheme = await _schemeProvider.GetSchemeAsync(GoogleDefaults.AuthenticationScheme);
            if (googleScheme == null)
            {
                _logger.LogWarning("Google authentication scheme is not configured on callback.");
                return StatusCode(501, new { error = "Google authentication is not configured on the server." });
            }
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                // When info is null, restart the external login challenge
                _logger.LogWarning("External login info is null. Restarting challenge.");
                return Redirect($"/api/auth/google?returnUrl={Uri.EscapeDataString(returnUrl)}");
            }

            // Try sign-in by external login first
            var signIn = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
            if (signIn.Succeeded)
            {
                _logger.LogInformation("External login sign-in succeeded. Provider={Provider} Key={Key}", info.LoginProvider, info.ProviderKey);
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
                return RedirectToSpa(returnUrl);
            }

            var email = info.Principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
            var name = info.Principal.Identity?.Name ?? email;

            if (string.IsNullOrWhiteSpace(email))
            {
                _logger.LogWarning("External login missing email. Provider={Provider}, ProviderKey={Key}", info.LoginProvider, info.ProviderKey);
                return BadRequest(new { error = "Email not provided by external provider." });
            }

            // If user with this email exists, use it; otherwise create one
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogInformation("Creating new user for email {Email}", email);
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = string.IsNullOrWhiteSpace(name) ? email : name,
                    EmailConfirmed = true
                };
                var create = await _userManager.CreateAsync(user);
                if (!create.Succeeded)
                {
                    _logger.LogWarning("Failed to create user from external login. Errors={Errors}", string.Join(",", create.Errors.Select(e => e.Code)));
                    return BadRequest(new { error = "Failed to create user", details = create.Errors });
                }
                else
                {
                    _logger.LogInformation("User created. userId={UserId}", user.Id);
                }
            }

            var addLogin = await _userManager.AddLoginAsync(user, info);
            if (!addLogin.Succeeded)
            {
                _logger.LogWarning("Failed to add external login. Errors={Errors}", string.Join(",", addLogin.Errors.Select(e => e.Code)));
                return BadRequest(new { error = "Failed to link external login", details = addLogin.Errors });
            }
            else
            {
                _logger.LogInformation("External login linked. userId={UserId} provider={Provider}", user.Id, info.LoginProvider);
            }

            var existingRoles = await _userManager.GetRolesAsync(user);
            if (!existingRoles.Any())
            {
                await _userManager.AddToRoleAsync(user, "customer");
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            _logger.LogInformation("User signed in via external provider. userId={UserId}", user.Id);
            return RedirectToSpa(returnUrl);
        }

        private IActionResult RedirectToSpa(string? returnUrl)
        {
            // Allow only relative local paths OR absolute URLs whose origin matches configured SPA origins
            if (!string.IsNullOrWhiteSpace(returnUrl))
            {
                if (Url.IsLocalUrl(returnUrl))
                {
                    return LocalRedirect(returnUrl);
                }
                if (Uri.TryCreate(returnUrl, UriKind.Absolute, out var abs))
                {
                    var allowed = HttpContext.RequestServices.GetRequiredService<IConfiguration>()
                        .GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
                    var origin = abs.GetLeftPart(UriPartial.Authority);
                    if (allowed.Contains(origin, StringComparer.OrdinalIgnoreCase))
                    {
                        return Redirect(returnUrl);
                    }
                }
            }
            // Fallback to SPA base /manager
            return Redirect($"{_spaBaseUrl}/manager");
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Ok(new { authenticated = false });
            }
            var user = await _userManager.GetUserAsync(User);
            var roles = user != null ? await _userManager.GetRolesAsync(user) : Array.Empty<string>();
            return Ok(new
            {
                authenticated = true,
                name = User.Identity?.Name,
                userId = user?.Id,
                fullName = user?.FullName,
                roles,
                claims = User.Claims.Select(c => new { c.Type, c.Value })
            });
        }

        public record LoginDto(string Email, string Password, bool RememberMe = false);

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            _logger.LogInformation("Password login attempt for {Email}", dto.Email);
            var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, dto.RememberMe, lockoutOnFailure: false);
            if (!result.Succeeded)
            {
                _logger.LogWarning("Password login failed for {Email}. IsLockedOut={LockedOut}, IsNotAllowed={NotAllowed}", dto.Email, result.IsLockedOut, result.IsNotAllowed);
                return Unauthorized(new { error = "Invalid email or password" });
            }
            return Ok(new { ok = true });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (User.Identity?.IsAuthenticated ?? false)
            {
                await _signInManager.SignOutAsync();
            }
            return Ok(new { ok = true });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized(new { error = "Not authenticated" });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized(new { error = "User not found" });

            var hasPassword = await _userManager.HasPasswordAsync(user);

            if (hasPassword && string.IsNullOrWhiteSpace(dto.CurrentPassword))
            {
                return BadRequest(new { error = "Current password is required" });
            }

            IdentityResult result;
            if (hasPassword)
            {
                result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            }
            else
            {
                result = await _userManager.AddPasswordAsync(user, dto.NewPassword);
            }

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    error = "Failed to change password",
                    details = result.Errors.Select(e => new { e.Code, e.Description })
                });
            }

            return Ok(new { ok = true });
        }

        [HttpGet("external-failed")]
        public IActionResult ExternalFailed([FromQuery] string? error = null, [FromQuery] string? returnUrl = "/login")
        {
            // Redirect back to SPA login on the same origin as returnUrl (if absolute), otherwise /login
            var msg = string.IsNullOrWhiteSpace(error) ? "access_denied" : error;
            string target;
            if (!string.IsNullOrWhiteSpace(returnUrl) && Uri.TryCreate(returnUrl, UriKind.Absolute, out var abs))
            {
                var baseOrigin = abs.GetLeftPart(UriPartial.Authority);
                target = $"{baseOrigin}/login";
            }
            else
            {
                target = $"{_spaBaseUrl}/login";
            }
            var connector = target.Contains('?') ? "&" : "?";
            return Redirect($"{target}{connector}error={Uri.EscapeDataString(msg)}");
        }

        // Dev-only helper: ensure the current authenticated principal has a local user record
        [HttpPost("ensure-user")]
        public async Task<IActionResult> EnsureUser()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized(new { error = "Not authenticated" });
            }

            var email = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/emailaddress"))?.Value
                        ?? User.Claims.FirstOrDefault(c => c.Type.Contains("email", StringComparison.OrdinalIgnoreCase))?.Value
                        ?? string.Empty;
            var name = User.Identity?.Name ?? email;

            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { error = "No email claim present" });
            }

            var existing = await _userManager.FindByEmailAsync(email);
            if (existing != null)
            {
                return Ok(new { ensured = true, existed = true, userId = existing.Id, email });
            }

            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FullName = string.IsNullOrWhiteSpace(name) ? email : name,
                EmailConfirmed = true
            };
            var create = await _userManager.CreateAsync(user);
            if (!create.Succeeded)
            {
                return BadRequest(new { error = "Failed to create user", details = create.Errors });
            }

            // Try to attach the most recent external login if available
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info != null)
            {
                await _userManager.AddLoginAsync(user, info);
            }

            return Ok(new { ensured = true, existed = false, userId = user.Id, email });
        }
    }
}

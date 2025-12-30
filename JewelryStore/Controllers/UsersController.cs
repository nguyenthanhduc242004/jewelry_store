using JewelryStore.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace JewelryStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _db;

        public UsersController(UserManager<ApplicationUser> userManager, AppDbContext db)
        {
            _userManager = userManager;
            _db = db;
        }

        public record UserListItemDto(int Id, string FullName, string Email, string Phone, string? Address, DateTime? Birthday, bool Status);
        public record UserDetailDto(int Id, string FullName, string Email, string Phone, string? Address, DateTime? Birthday, bool Status, string? Role);
        public record UserSummaryDto(int Id, string FullName, string Email, string Phone, string? Address, DateTime? Birthday, string? Role, string? ImageUrl, string Account, int Bill);
        public record CreateUserDto(string FullName, string Email, string Password, string Phone, string? Address, DateTime? Birthday, bool Status = true, string? Role = null);
        public record UpdateUserDto(string FullName, string Email, string Phone, string? Address, DateTime? Birthday, bool Status);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserListItemDto>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (take <= 0 || take > 200) take = 50;
                var users = await _userManager.Users
                    .AsNoTracking()
                    .OrderBy(u => u.Id)
                    .Skip(skip)
                    .Take(take)
                    .Select(u => new UserListItemDto(u.Id, u.FullName, u.Email ?? string.Empty, u.PhoneNumber ?? string.Empty, u.Address, u.Birthday, u.Status))
                    .ToListAsync();
                return Ok(users);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching users" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<UserListItemDto>> GetById([FromRoute] int id)
        {
            try
            {
                var user = await _userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
                if (user == null) return NotFound(new { error = "User not found" });
                var roles = await _userManager.GetRolesAsync(user);
                return Ok(new UserDetailDto(user.Id, user.FullName, user.Email ?? string.Empty, user.PhoneNumber ?? string.Empty, user.Address, user.Birthday, user.Status, roles.FirstOrDefault()));
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching user" });
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<IEnumerable<UserSummaryDto>>> GetSummary([FromQuery] int skip = 0, [FromQuery] int take = 100)
        {
            try
            {
                if (take <= 0 || take > 200) take = 100;
                var users = await _userManager.Users
                    .AsNoTracking()
                    .OrderBy(u => u.Id)
                    .Skip(skip)
                    .Take(take)
                    .ToListAsync();

                var userIds = users.Select(u => u.Id).ToList();
                var images = await _db.UserImages
                    .AsNoTracking()
                    .Where(i => userIds.Contains(i.UserId))
                    .ToDictionaryAsync(i => i.UserId, i => i.ImageUrl);

                var summaries = new List<UserSummaryDto>(users.Count);
                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var role = roles.FirstOrDefault();
                    images.TryGetValue(user.Id, out var imageUrl);

                    summaries.Add(new UserSummaryDto(
                        user.Id,
                        user.FullName,
                        user.Email ?? string.Empty,
                        user.PhoneNumber ?? string.Empty,
                        user.Address,
                        user.Birthday,
                        role,
                        imageUrl,
                        user.Email ?? string.Empty,
                        0
                    ));
                }

                return Ok(summaries);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching user summaries" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            try
            {
                var user = new ApplicationUser
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    UserName = dto.Email,
                    PhoneNumber = dto.Phone,
                    Address = dto.Address,
                    Birthday = dto.Birthday,
                    Status = dto.Status
                };

                var result = await _userManager.CreateAsync(user, dto.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        error = "Error creating user",
                        details = result.Errors.Select(e => new { e.Code, e.Description })
                    });
                }

                var roleToAssign = string.IsNullOrWhiteSpace(dto.Role) ? "customer" : dto.Role;
                await _userManager.AddToRoleAsync(user, roleToAssign);

                return CreatedAtAction(nameof(GetById), new { id = user.Id }, new UserListItemDto(user.Id, user.FullName, user.Email ?? string.Empty, user.PhoneNumber ?? string.Empty, user.Address, user.Birthday, user.Status));
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error creating user" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null) return NotFound(new { error = "User not found" });

                user.FullName = dto.FullName;
                user.Email = dto.Email;
                user.UserName = dto.Email;
                user.PhoneNumber = dto.Phone;
                user.Address = dto.Address;
                user.Birthday = dto.Birthday.HasValue
                    ? DateTime.SpecifyKind(dto.Birthday.Value, DateTimeKind.Utc)
                    : null;
                user.Status = dto.Status;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        error = "Error updating user",
                        details = result.Errors.Select(e => new { e.Code, e.Description })
                    });
                }

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error updating user" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null) return NotFound(new { error = "User not found" });

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { error = "Error deleting user" });
                }

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error deleting user" });
            }
        }

        [HttpPost("{id:int}/reset-password")]
        public async Task<IActionResult> ResetPassword([FromRoute] int id, [FromBody] ResetPasswordDto dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null) return NotFound(new { error = "User not found" });
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new { error = "Error resetting password", details = result.Errors.Select(e => new { e.Code, e.Description }) });
                }
                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error resetting password" });
            }
        }

        public record ResetPasswordDto(string Password);
    }
}
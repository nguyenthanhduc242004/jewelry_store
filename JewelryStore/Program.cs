using JewelryStore.Data;
using JewelryStore.Data.Seed;
using JewelryStore.Plugins;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using JewelryStore.Options;
using JewelryStore.Services;
using Microsoft.SemanticKernel;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<CloudinaryOptions>(builder.Configuration.GetSection(CloudinaryOptions.SectionName));
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

// Register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IGemstoneService, GemstoneService>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();

// Register JewelryShopPlugin as Transient
builder.Services.AddTransient<JewelryShopPlugin>();

// Register Semantic Kernel with Google Gemini
var geminiApiKey = builder.Configuration["Gemini:ApiKey"];
if (string.IsNullOrEmpty(geminiApiKey))
{
    throw new InvalidOperationException("Gemini:ApiKey is not configured in secrets or appsettings");
}
builder.Services.AddKernel();
builder.Services.AddGoogleAIGeminiChatCompletion("gemini-flash-latest", geminiApiKey);

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
builder.Services.ConfigureExternalCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// External authentication providers (Google)
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
{
    builder.Services
        .AddAuthentication()
        .AddGoogle(options =>
        {
            options.ClientId = googleClientId!;
            options.ClientSecret = googleClientSecret!;
            options.CorrelationCookie.SameSite = SameSiteMode.None;
            options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
            // Ensure email and basic profile are requested and mapped
            options.Scope.Clear();
            options.Scope.Add("openid");
            options.Scope.Add("profile");
            options.Scope.Add("email");
            options.SaveTokens = true;
            // options.CallbackPath = "/signin-google"; // default
            options.Events = new OAuthEvents
            {
                OnRemoteFailure = context =>
                {
                    // User canceled or provider error -> redirect gracefully to login with message
                    var msg = Uri.EscapeDataString(context.Failure?.Message ?? "access_denied");
                    var returnUrl = context.Request.Query["returnUrl"].ToString();
                    var encodedReturn = Uri.EscapeDataString(string.IsNullOrWhiteSpace(returnUrl) ? "/" : returnUrl);
                    context.Response.Redirect($"/api/auth/external-failed?error={msg}&returnUrl={encodedReturn}");
                    context.HandleResponse();
                    return Task.CompletedTask;
                }
            };
        });
}

// CORS for SPA
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[]
{
    "http://localhost:5173",
    "https://localhost:5173"
};
builder.Services.AddCors(p =>
{
    p.AddPolicy("spa", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("spa");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    await IdentitySeeder.SeedAsync(scope);
    await CatalogSeeder.SeedAsync(scope);
    await OrderSeeder.SeedAsync(scope); // uncomment when users exist
    await ImportSeeder.SeedAsync(scope); // suppliers + imports
}

app.Run();

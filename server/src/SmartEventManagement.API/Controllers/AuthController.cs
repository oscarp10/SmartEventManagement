using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartEventManagement.API.DTOs;
using SmartEventManagement.API.Services;
using SmartEventManagement.API.Models;
using SmartEventManagement.API.Data;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly IPasswordHasher _passwordHasher;

    public AuthController(
        AppDbContext dbContext,
        IConfiguration configuration,
        IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var existing = await _dbContext.Profiles.FirstOrDefaultAsync(x => x.Email == email);
        if (existing is not null)
        {
            return Conflict("Email is already registered.");
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
        {
            return BadRequest("Password must be at least 8 characters.");
        }

        var profile = new Profile
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = request.Role,
            Interests = request.Interests ?? []
        };

        _dbContext.Profiles.Add(profile);
        await _dbContext.SaveChangesAsync();

        var token = GenerateToken(profile);
        return Ok(new AuthResponse(token, ToProfileResponse(profile)));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var profile = await _dbContext.Profiles.FirstOrDefaultAsync(x => x.Email == email);
        if (profile is null)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (!_passwordHasher.VerifyPassword(request.Password, profile.PasswordHash))
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = GenerateToken(profile);
        return Ok(new AuthResponse(token, ToProfileResponse(profile)));
    }

    private string GenerateToken(Profile profile)
    {
        var issuer = _configuration["Auth:Issuer"] ?? "SmartEventManagement.Local";
        var audience = _configuration["Auth:Audience"] ?? "SmartEventManagement.Client";
        var key = _configuration["Auth:JwtSecret"] ?? "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_FOR_DEV";
        var expiresInMinutes = int.TryParse(_configuration["Auth:TokenExpiryMinutes"], out var minutes) ? minutes : 120;

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, profile.Id.ToString()),
            new(ClaimTypes.Email, profile.Email),
            new(ClaimTypes.Name, profile.FullName),
            new(ClaimTypes.Role, profile.Role.ToString())
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static AuthProfileResponse ToProfileResponse(Profile profile)
    {
        return new AuthProfileResponse(
            profile.Id,
            profile.FullName,
            profile.Email,
            profile.Role,
            profile.Interests
        );
    }
}

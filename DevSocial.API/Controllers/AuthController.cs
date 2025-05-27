using DevSocial.API.Data;
using DevSocial.API.DTOs;
using DevSocial.API.Models;
using DevSocial.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevSocial.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            TokenService tokenService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                return BadRequest("Email is already taken");
            }

            var user = new ApplicationUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                Bio = registerDto.Bio ?? string.Empty,
                GitHubUrl = registerDto.GitHubUrl ?? string.Empty,
                LinkedInUrl = registerDto.LinkedInUrl ?? string.Empty
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var token = await _tokenService.CreateToken(user);

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                GitHubUrl = user.GitHubUrl,
                LinkedInUrl = user.LinkedInUrl,
                Token = token
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized("Invalid email or password");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("Invalid email or password");

            var token = await _tokenService.CreateToken(user);

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                GitHubUrl = user.GitHubUrl,
                LinkedInUrl = user.LinkedInUrl,
                Token = token
            };
        }
    }
} 
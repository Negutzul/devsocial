using System.Security.Claims;
using DevSocial.API.Data;
using DevSocial.API.DTOs;
using DevSocial.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevSocial.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public ProfilesController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProfileDto>> GetProfile(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            return new ProfileDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                GitHubUrl = user.GitHubUrl,
                LinkedInUrl = user.LinkedInUrl,
                ProfilePictureUrl = user.ProfilePictureUrl ?? "/images/default-profile.png",
                CreatedAt = user.CreatedAt,
                LastActive = user.LastActive
            };
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<ProfileDto>> UpdateProfile(ProfileDto profileDto)
        {
            var user = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (user == null) return Unauthorized();

            user.DisplayName = profileDto.DisplayName;
            user.Bio = profileDto.Bio;
            user.GitHubUrl = profileDto.GitHubUrl;
            user.LinkedInUrl = profileDto.LinkedInUrl;
            user.LastActive = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return new ProfileDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                GitHubUrl = user.GitHubUrl,
                LinkedInUrl = user.LinkedInUrl,
                ProfilePictureUrl = user.ProfilePictureUrl ?? "/images/default-profile.png",
                CreatedAt = user.CreatedAt,
                LastActive = user.LastActive
            };
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<ProfileDto>>> SearchProfiles(string? searchTerm = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u => u.DisplayName.Contains(searchTerm) || u.Email.Contains(searchTerm));
            }

            var users = await query
                .Select(u => new ProfileDto
                {
                    Id = u.Id,
                    DisplayName = u.DisplayName,
                    Bio = u.Bio,
                    GitHubUrl = u.GitHubUrl,
                    LinkedInUrl = u.LinkedInUrl,
                    ProfilePictureUrl = u.ProfilePictureUrl ?? "/images/default-profile.png",
                    CreatedAt = u.CreatedAt,
                    LastActive = u.LastActive
                })
                .ToListAsync();

            return users;
        }
    }
} 
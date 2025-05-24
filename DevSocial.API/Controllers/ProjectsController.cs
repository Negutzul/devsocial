using DevSocial.API.Data;
using DevSocial.API.DTOs;
using DevSocial.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevSocial.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProjectsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProjectDto>>> GetProjects(string userId = null)
        {
            var query = _context.Projects
                .Include(p => p.Author)
                .AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(p => p.AuthorId == userId);
            }

            var projects = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    ProjectUrl = p.ProjectUrl,
                    ImageUrl = p.ImageUrl,
                    Technologies = p.Technologies,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    AuthorId = p.AuthorId,
                    AuthorDisplayName = p.Author.DisplayName
                })
                .ToListAsync();

            return projects;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                ProjectUrl = project.ProjectUrl,
                ImageUrl = project.ImageUrl,
                Technologies = project.Technologies,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                AuthorId = project.AuthorId,
                AuthorDisplayName = project.Author.DisplayName
            };
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto projectDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return Unauthorized();

            var project = new Project
            {
                Title = projectDto.Title,
                Description = projectDto.Description,
                ProjectUrl = projectDto.ProjectUrl,
                ImageUrl = projectDto.ImageUrl,
                Technologies = projectDto.Technologies,
                AuthorId = userId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                ProjectUrl = project.ProjectUrl,
                ImageUrl = project.ImageUrl,
                Technologies = project.Technologies,
                CreatedAt = project.CreatedAt,
                AuthorId = project.AuthorId,
                AuthorDisplayName = user.DisplayName
            };
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectDto>> UpdateProject(int id, UpdateProjectDto projectDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var project = await _context.Projects
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();
            if (project.AuthorId != userId) return Unauthorized();

            project.Title = projectDto.Title;
            project.Description = projectDto.Description;
            project.ProjectUrl = projectDto.ProjectUrl;
            project.ImageUrl = projectDto.ImageUrl;
            project.Technologies = projectDto.Technologies;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                ProjectUrl = project.ProjectUrl,
                ImageUrl = project.ImageUrl,
                Technologies = project.Technologies,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                AuthorId = project.AuthorId,
                AuthorDisplayName = project.Author.DisplayName
            };
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();
            if (project.AuthorId != userId) return Unauthorized();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
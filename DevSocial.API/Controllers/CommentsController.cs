using DevSocial.API.Data;
using DevSocial.API.DTOs;
using DevSocial.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DevSocial.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CommentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<CommentDto>>> GetComments(int postId)
        {
            var comments = await _context.Comments
                .Include(c => c.Author)
                .Where(c => c.PostId == postId)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    AuthorId = c.AuthorId,
                    AuthorDisplayName = c.Author.DisplayName,
                    PostId = c.PostId
                })
                .ToListAsync();

            return comments;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDto>> GetComment(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.Author)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null) return NotFound();

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                AuthorId = comment.AuthorId,
                AuthorDisplayName = comment.Author.DisplayName,
                PostId = comment.PostId
            };
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CommentDto>> CreateComment(CommentDto commentDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return Unauthorized();

            var comment = new Comment
            {
                Content = commentDto.Content,
                AuthorId = userId,
                PostId = commentDto.PostId
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                AuthorId = comment.AuthorId,
                AuthorDisplayName = user.DisplayName,
                PostId = comment.PostId
            };
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDto>> UpdateComment(int id, CommentDto commentDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var comment = await _context.Comments
                .Include(c => c.Author)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null) return NotFound();
            if (comment.AuthorId != userId) return Unauthorized();

            comment.Content = commentDto.Content;
            await _context.SaveChangesAsync();

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                AuthorId = comment.AuthorId,
                AuthorDisplayName = comment.Author.DisplayName,
                PostId = comment.PostId
            };
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var comment = await _context.Comments
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null) return NotFound();
            if (comment.AuthorId != userId) return Unauthorized();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
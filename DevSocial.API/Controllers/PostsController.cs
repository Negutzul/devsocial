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
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<PostDto>>> GetPosts()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var posts = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    CodeSnippet = p.CodeSnippet,
                    Language = p.Language,
                    Link = p.Link,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    AuthorId = p.AuthorId,
                    AuthorDisplayName = p.Author.DisplayName,
                    LikeCount = p.Likes.Count,
                    CommentCount = p.Comments.Count,
                    IsLiked = userId != null && p.Likes.Any(l => l.UserId == userId)
                })
                .ToListAsync();

            return posts;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var post = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CodeSnippet = post.CodeSnippet,
                Language = post.Language,
                Link = post.Link,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                AuthorId = post.AuthorId,
                AuthorDisplayName = post.Author.DisplayName,
                LikeCount = post.Likes.Count,
                CommentCount = post.Comments.Count,
                IsLiked = userId != null && post.Likes.Any(l => l.UserId == userId)
            };
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto postDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return Unauthorized();

            var post = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                CodeSnippet = postDto.CodeSnippet,
                Language = postDto.Language,
                Link = postDto.Link,
                AuthorId = userId
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CodeSnippet = post.CodeSnippet,
                Language = post.Language,
                Link = post.Link,
                CreatedAt = post.CreatedAt,
                AuthorId = post.AuthorId,
                AuthorDisplayName = user.DisplayName,
                LikeCount = 0,
                CommentCount = 0,
                IsLiked = false
            };
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<PostDto>> UpdatePost(int id, UpdatePostDto postDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var post = await _context.Posts
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();
            if (post.AuthorId != userId) return Unauthorized();

            post.Title = postDto.Title;
            post.Content = postDto.Content;
            post.CodeSnippet = postDto.CodeSnippet;
            post.Language = postDto.Language;
            post.Link = postDto.Link;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CodeSnippet = post.CodeSnippet,
                Language = post.Language,
                Link = post.Link,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                AuthorId = post.AuthorId,
                AuthorDisplayName = post.Author.DisplayName,
                LikeCount = post.Likes.Count,
                CommentCount = post.Comments.Count,
                IsLiked = post.Likes.Any(l => l.UserId == userId)
            };
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();
            if (post.AuthorId != userId) return Unauthorized();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<ActionResult> LikePost(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var post = await _context.Posts
                .Include(p => p.Likes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();

            var like = post.Likes.FirstOrDefault(l => l.UserId == userId);
            if (like != null)
            {
                post.Likes.Remove(like);
            }
            else
            {
                post.Likes.Add(new Like { UserId = userId });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 
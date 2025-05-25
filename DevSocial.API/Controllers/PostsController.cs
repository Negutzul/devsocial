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

        public PostsController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<PostDto>>> GetPosts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? tag = null,
            [FromQuery] string? feedType = "all") // "all" or "following"
        {
            var query = _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Tags)
                .AsQueryable();

            // Get current user for like status and following filter
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Filter by followed users if feedType is "following"
            if (feedType?.ToLower() == "following" && currentUserId != null)
            {
                var followedUserIds = await _context.UserFollows
                    .Where(uf => uf.FollowerId == currentUserId)
                    .Select(uf => uf.FollowingId)
                    .ToListAsync();

                // Include current user's posts in the feed
                followedUserIds.Add(currentUserId);
                query = query.Where(p => followedUserIds.Contains(p.AuthorId));
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(p => 
                    p.Title.Contains(searchTerm) || 
                    p.Content.Contains(searchTerm) ||
                    (p.CodeSnippet != null && p.CodeSnippet.Contains(searchTerm)));
            }

            // Apply tag filter
            if (!string.IsNullOrWhiteSpace(tag))
            {
                query = query.Where(p => p.Tags.Any(t => t.Name == tag));
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    CodeSnippet = p.CodeSnippet,
                    CodeLanguage = p.CodeLanguage,
                    ImageUrl = p.ImageUrl,
                    AuthorId = p.AuthorId,
                    AuthorName = p.Author.DisplayName,
                    AuthorProfilePictureUrl = p.Author.ProfilePictureUrl,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    LikeCount = p.Likes.Count,
                    CommentCount = p.Comments.Count,
                    IsLikedByCurrentUser = currentUserId != null && p.Likes.Any(l => l.UserId == currentUserId),
                    Tags = p.Tags.Select(t => t.Name).ToList()
                })
                .ToListAsync();

            // Add pagination info to response headers
            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Total-Pages", Math.Ceiling((double)totalCount / pageSize).ToString());

            return posts;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var post = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Tags)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CodeSnippet = post.CodeSnippet,
                CodeLanguage = post.CodeLanguage,
                ImageUrl = post.ImageUrl,
                AuthorId = post.AuthorId,
                AuthorName = post.Author.DisplayName,
                AuthorProfilePictureUrl = post.Author.ProfilePictureUrl,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                LikeCount = post.Likes.Count,
                CommentCount = post.Comments.Count,
                IsLikedByCurrentUser = currentUserId != null && post.Likes.Any(l => l.UserId == currentUserId),
                Tags = post.Tags.Select(t => t.Name).ToList()
            };
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto createPostDto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(currentUserId);

            if (user == null)
                return Unauthorized();

            var post = new Post
            {
                Title = createPostDto.Title,
                Content = createPostDto.Content,
                CodeSnippet = createPostDto.CodeSnippet,
                CodeLanguage = createPostDto.CodeLanguage,
                ImageUrl = createPostDto.ImageUrl,
                AuthorId = currentUserId
            };

            // Handle tags
            foreach (var tagName in createPostDto.Tags)
            {
                var tag = await _context.PostTags
                    .FirstOrDefaultAsync(t => t.Name == tagName) ?? new PostTag { Name = tagName };
                post.Tags.Add(tag);
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return await GetPost(post.Id);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<PostDto>> UpdatePost(int id, CreatePostDto updatePostDto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var post = await _context.Posts
                .Include(p => p.Tags)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound();

            if (post.AuthorId != currentUserId)
                return Forbid();

            post.Title = updatePostDto.Title;
            post.Content = updatePostDto.Content;
            post.CodeSnippet = updatePostDto.CodeSnippet;
            post.CodeLanguage = updatePostDto.CodeLanguage;
            post.ImageUrl = updatePostDto.ImageUrl;
            post.UpdatedAt = DateTime.UtcNow;

            // Update tags
            post.Tags.Clear();
            foreach (var tagName in updatePostDto.Tags)
            {
                var tag = await _context.PostTags
                    .FirstOrDefaultAsync(t => t.Name == tagName) ?? new PostTag { Name = tagName };
                post.Tags.Add(tag);
            }

            await _context.SaveChangesAsync();

            return await GetPost(post.Id);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            if (post.AuthorId != currentUserId)
                return Forbid();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<ActionResult> LikePost(int id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var post = await _context.Posts
                .Include(p => p.Likes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound();

            if (post.Likes.Any(l => l.UserId == currentUserId))
                return BadRequest("Post already liked");

            post.Likes.Add(new PostLike
            {
                PostId = id,
                UserId = currentUserId
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}/like")]
        public async Task<ActionResult> UnlikePost(int id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var like = await _context.PostLikes
                .FirstOrDefaultAsync(l => l.PostId == id && l.UserId == currentUserId);

            if (like == null)
                return BadRequest("Post not liked");

            _context.PostLikes.Remove(like);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
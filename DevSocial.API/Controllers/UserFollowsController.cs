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
    public class UserFollowsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserFollowsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("followers/{userId}")]
        public async Task<ActionResult<List<UserFollowDto>>> GetFollowers(string userId)
        {
            var followers = await _context.UserFollows
                .Include(uf => uf.Follower)
                .Where(uf => uf.FollowingId == userId)
                .OrderByDescending(uf => uf.CreatedAt)
                .Select(uf => new UserFollowDto
                {
                    FollowerId = uf.FollowerId,
                    FollowerDisplayName = uf.Follower.DisplayName,
                    FollowingId = uf.FollowingId,
                    FollowingDisplayName = uf.Following.DisplayName,
                    CreatedAt = uf.CreatedAt
                })
                .ToListAsync();

            return followers;
        }

        [HttpGet("following/{userId}")]
        public async Task<ActionResult<List<UserFollowDto>>> GetFollowing(string userId)
        {
            var following = await _context.UserFollows
                .Include(uf => uf.Following)
                .Where(uf => uf.FollowerId == userId)
                .OrderByDescending(uf => uf.CreatedAt)
                .Select(uf => new UserFollowDto
                {
                    FollowerId = uf.FollowerId,
                    FollowerDisplayName = uf.Follower.DisplayName,
                    FollowingId = uf.FollowingId,
                    FollowingDisplayName = uf.Following.DisplayName,
                    CreatedAt = uf.CreatedAt
                })
                .ToListAsync();

            return following;
        }

        [HttpGet("stats/{userId}")]
        public async Task<ActionResult<UserFollowStatsDto>> GetFollowStats(string userId)
        {
            var followersCount = await _context.UserFollows
                .CountAsync(uf => uf.FollowingId == userId);

            var followingCount = await _context.UserFollows
                .CountAsync(uf => uf.FollowerId == userId);

            return new UserFollowStatsDto
            {
                FollowersCount = followersCount,
                FollowingCount = followingCount
            };
        }

        [Authorize]
        [HttpGet("isfollowing/{userId}")]
        public async Task<ActionResult<IsFollowingDto>> IsFollowing(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var isFollowing = await _context.UserFollows
                .AnyAsync(uf => uf.FollowerId == currentUserId && uf.FollowingId == userId);

            return new IsFollowingDto { IsFollowing = isFollowing };
        }

        [Authorize]
        [HttpPost("follow/{userId}")]
        public async Task<ActionResult<UserFollowDto>> FollowUser(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (currentUserId == userId)
                return BadRequest("You cannot follow yourself");

            var userToFollow = await _userManager.FindByIdAsync(userId);
            if (userToFollow == null)
                return NotFound("User not found");

            var existingFollow = await _context.UserFollows
                .FirstOrDefaultAsync(uf => uf.FollowerId == currentUserId && uf.FollowingId == userId);

            if (existingFollow != null)
                return BadRequest("You are already following this user");

            var follow = new UserFollow
            {
                FollowerId = currentUserId,
                FollowingId = userId
            };

            _context.UserFollows.Add(follow);
            await _context.SaveChangesAsync();

            return new UserFollowDto
            {
                FollowerId = follow.FollowerId,
                FollowerDisplayName = (await _userManager.FindByIdAsync(follow.FollowerId)).DisplayName,
                FollowingId = follow.FollowingId,
                FollowingDisplayName = userToFollow.DisplayName,
                CreatedAt = follow.CreatedAt
            };
        }

        [Authorize]
        [HttpDelete("unfollow/{userId}")]
        public async Task<ActionResult> UnfollowUser(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var follow = await _context.UserFollows
                .FirstOrDefaultAsync(uf => uf.FollowerId == currentUserId && uf.FollowingId == userId);

            if (follow == null)
                return NotFound("Follow relationship not found");

            _context.UserFollows.Remove(follow);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
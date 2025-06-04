using DevSocial.API.Data;
using DevSocial.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System.Security.Claims;

namespace DevSocial.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilePictureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;
        private const int MaxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
        private const int MaxImageDimension = 512; // Max width/height in pixels
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

        public ProfilePictureController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment environment)
        {
            _context = context;
            _userManager = userManager;
            _environment = environment;
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<ActionResult<ProfilePictureResponse>> GetCurrentUserProfilePicture()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(currentUserId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new ProfilePictureResponse { Url = user.ProfilePictureUrl });
        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<ActionResult<ProfilePictureResponse>> GetUserProfilePicture(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new ProfilePictureResponse { Url = user.ProfilePictureUrl });
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<ActionResult<string>> UploadProfilePicture(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Validate file size
            if (file.Length > MaxFileSizeInBytes)
                return BadRequest($"File size too large. Maximum size is {MaxFileSizeInBytes / (1024 * 1024)}MB");

            // Validate file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                return BadRequest("Invalid file type. Only JPEG, PNG and GIF are allowed");

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(currentUserId);

            if (user == null)
                return NotFound("User not found");

            // Generate secure filename
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_environment.WebRootPath, "profile-pictures", fileName);

            // Ensure directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            try
            {
                // Process and save the image
                using (var image = await Image.LoadAsync(file.OpenReadStream()))
                {
                    // Resize if needed
                    if (image.Width > MaxImageDimension || image.Height > MaxImageDimension)
                    {
                        image.Mutate(x => x.Resize(new ResizeOptions
                        {
                            Size = new Size(MaxImageDimension, MaxImageDimension),
                            Mode = ResizeMode.Max
                        }));
                    }

                    // Save the processed image
                    await image.SaveAsJpegAsync(filePath, new JpegEncoder
                    {
                        Quality = 85 // Good balance between quality and file size
                    });
                }

                // Delete old profile picture if it exists
                if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
                {
                    var oldFilePath = Path.Combine(_environment.WebRootPath, "profile-pictures", 
                        Path.GetFileName(user.ProfilePictureUrl));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Update user's profile picture URL
                user.ProfilePictureUrl = $"/profile-pictures/{fileName}";
                await _userManager.UpdateAsync(user);

                return Ok(new ProfilePictureResponse { Url = user.ProfilePictureUrl });
            }
            catch (Exception ex)
            {
                // Clean up the file if something goes wrong
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                return StatusCode(500, "Error processing image: " + ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("remove")]
        public async Task<ActionResult> RemoveProfilePicture()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(currentUserId);

            if (user == null)
                return NotFound("User not found");

            if (string.IsNullOrEmpty(user.ProfilePictureUrl))
                return BadRequest("No profile picture to remove");

            // Delete the file
            var filePath = Path.Combine(_environment.WebRootPath, "profile-pictures", 
                Path.GetFileName(user.ProfilePictureUrl));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            // Update user's profile picture URL
            user.ProfilePictureUrl = null;
            await _userManager.UpdateAsync(user);

            return NoContent();
        }
    }

    public class ProfilePictureResponse
    {
        public string Url { get; set; }
    }
} 
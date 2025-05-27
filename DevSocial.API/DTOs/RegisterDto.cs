using System.ComponentModel.DataAnnotations;

namespace DevSocial.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string DisplayName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        public string? Bio { get; set; }
        public string? GitHubUrl { get; set; }
        public string? LinkedInUrl { get; set; }
    }
} 
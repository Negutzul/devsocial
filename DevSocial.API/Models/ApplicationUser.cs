using Microsoft.AspNetCore.Identity;

namespace DevSocial.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string GitHubUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastActive { get; set; } = DateTime.UtcNow;
    }
}
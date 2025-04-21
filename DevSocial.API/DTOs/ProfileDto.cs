namespace DevSocial.API.DTOs
{
    public class ProfileDto
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string GitHubUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastActive { get; set; }
    }
} 
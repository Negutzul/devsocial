using System.ComponentModel.DataAnnotations;

namespace DevSocial.API.DTOs
{
    public class CreatePostDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public string? CodeSnippet { get; set; }
        
        public string? CodeLanguage { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public List<string> Tags { get; set; } = new List<string>();
    }
} 
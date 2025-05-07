using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevSocial.API.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public string? CodeSnippet { get; set; }
        
        public string? Language { get; set; }
        
        public string? Link { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        [Required]
        public string AuthorId { get; set; }
        
        [ForeignKey("AuthorId")]
        public ApplicationUser Author { get; set; }
        
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
} 
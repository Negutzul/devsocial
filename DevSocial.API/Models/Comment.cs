using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevSocial.API.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public string? CodeSnippet { get; set; }
        
        public string? CodeLanguage { get; set; }
        
        [Required]
        public int PostId { get; set; }
        
        [ForeignKey("PostId")]
        public Post Post { get; set; }
        
        [Required]
        public string AuthorId { get; set; }
        
        [ForeignKey("AuthorId")]
        public ApplicationUser Author { get; set; }
        
        public int? ParentCommentId { get; set; }
        
        [ForeignKey("ParentCommentId")]
        public Comment? ParentComment { get; set; }
        
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
    }
} 
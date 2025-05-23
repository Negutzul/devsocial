using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevSocial.API.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Required]
        public string AuthorId { get; set; }
        
        [ForeignKey("AuthorId")]
        public ApplicationUser Author { get; set; }
        
        [Required]
        public int PostId { get; set; }
        
        [ForeignKey("PostId")]
        public Post Post { get; set; }
    }
} 
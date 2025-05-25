using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevSocial.API.Models
{
    public class PostLike
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PostId { get; set; }
        
        [ForeignKey("PostId")]
        public Post Post { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 
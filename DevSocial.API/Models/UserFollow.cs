using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevSocial.API.Models
{
    public class UserFollow
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string FollowerId { get; set; }

        [ForeignKey("FollowerId")]
        public ApplicationUser Follower { get; set; }

        [Required]
        public string FollowingId { get; set; }

        [ForeignKey("FollowingId")]
        public ApplicationUser Following { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 
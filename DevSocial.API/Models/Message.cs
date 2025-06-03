using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevSocial.API.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SenderId { get; set; }
        [ForeignKey("SenderId")]
        public ApplicationUser Sender { get; set; }

        [Required]
        public string RecipientId { get; set; }
        [ForeignKey("RecipientId")]
        public ApplicationUser Recipient { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        public DateTime? DeletedAt { get; set; }
    }
} 
using System;

namespace DevSocial.API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? AuthorId { get; set; }
        public string? AuthorDisplayName { get; set; }
        public int PostId { get; set; }
    }
} 
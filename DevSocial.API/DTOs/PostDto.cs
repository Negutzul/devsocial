namespace DevSocial.API.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? CodeSnippet { get; set; }
        public string? Language { get; set; }
        public string? Link { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string AuthorId { get; set; }
        public string AuthorDisplayName { get; set; }
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public bool IsLiked { get; set; }
    }

    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? CodeSnippet { get; set; }
        public string? Language { get; set; }
        public string? Link { get; set; }
    }

    public class UpdatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? CodeSnippet { get; set; }
        public string? Language { get; set; }
        public string? Link { get; set; }
    }
} 
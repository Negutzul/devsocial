namespace DevSocial.API.DTOs
{
    public class SendMessageDto
    {
        public string RecipientId { get; set; }
        public string Content { get; set; }
    }

    public class MessageResponseDto
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string SenderName { get; set; }
        public string RecipientId { get; set; }
        public string RecipientName { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
    }

    public class ConversationDto
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string LastMessage { get; set; }
        public DateTime LastMessageTime { get; set; }
        public string ProfilePictureUrl { get; set; }
    }
} 
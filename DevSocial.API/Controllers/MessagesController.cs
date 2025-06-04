using DevSocial.API.Data;
using DevSocial.API.DTOs;
using DevSocial.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevSocial.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public MessagesController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<ActionResult<MessageResponseDto>> SendMessage(SendMessageDto messageDto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var recipient = await _userManager.FindByIdAsync(messageDto.RecipientId);

            if (recipient == null)
                return NotFound("Recipient not found");

            var message = new Message
            {
                SenderId = currentUserId,
                RecipientId = messageDto.RecipientId,
                Content = messageDto.Content,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new MessageResponseDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = (await _userManager.FindByIdAsync(message.SenderId))?.DisplayName,
                RecipientId = message.RecipientId,
                RecipientName = recipient.DisplayName,
                Content = message.Content,
                SentAt = message.SentAt
            });
        }

        [HttpGet("conversations")]
        public async Task<ActionResult<List<ConversationDto>>> GetConversations()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var conversations = await _context.Messages
                .Where(m => (m.SenderId == currentUserId || m.RecipientId == currentUserId) && !m.IsDeleted)
                .OrderByDescending(m => m.SentAt)
                .Select(m => new
                {
                    OtherUserId = m.SenderId == currentUserId ? m.RecipientId : m.SenderId,
                    OtherUserName = m.SenderId == currentUserId ? m.Recipient.DisplayName : m.Sender.DisplayName,
                    OtherUserProfilePicture = m.SenderId == currentUserId ? m.Recipient.ProfilePictureUrl : m.Sender.ProfilePictureUrl,
                    LastMessage = m.Content,
                    LastMessageTime = m.SentAt
                })
                .ToListAsync();

            var conversationDtos = conversations
                .GroupBy(c => c.OtherUserId)
                .Select(g => new ConversationDto
                {
                    UserId = g.Key,
                    UserName = g.First().OtherUserName,
                    ProfilePictureUrl = g.First().OtherUserProfilePicture,
                    LastMessage = g.First().LastMessage,
                    LastMessageTime = g.First().LastMessageTime
                })
                .OrderByDescending(c => c.LastMessageTime)
                .ToList();

            return Ok(conversationDtos);
        }

        [HttpGet("conversation/{userId}")]
        public async Task<ActionResult<List<MessageResponseDto>>> GetConversation(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var messages = await _context.Messages
                .Where(m => ((m.SenderId == currentUserId && m.RecipientId == userId) ||
                           (m.SenderId == userId && m.RecipientId == currentUserId)) &&
                           !m.IsDeleted)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.DisplayName,
                    RecipientId = m.RecipientId,
                    RecipientName = m.Recipient.DisplayName,
                    Content = m.Content,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
                return NotFound("Message not found");

            if (message.SenderId != currentUserId)
                return Forbid();

            message.IsDeleted = true;
            message.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
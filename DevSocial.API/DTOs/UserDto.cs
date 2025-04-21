namespace DevSocial.API.DTOs
{
    public class UserDto : ProfileDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
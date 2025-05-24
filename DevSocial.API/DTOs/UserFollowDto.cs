namespace DevSocial.API.DTOs
{
    public class UserFollowDto
    {
        public string FollowerId { get; set; }
        public string FollowerDisplayName { get; set; }
        public string FollowingId { get; set; }
        public string FollowingDisplayName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserFollowStatsDto
    {
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
    }
} 
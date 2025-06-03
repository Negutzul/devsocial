using DevSocial.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DevSocial.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<UserFollow> UserFollows { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure unique constraint for likes (one like per user per post)
            builder.Entity<PostLike>()
                .HasIndex(l => new { l.UserId, l.PostId })
                .IsUnique();

            // Configure unique constraint for follows (one follow relationship per pair of users)
            builder.Entity<UserFollow>()
                .HasIndex(uf => new { uf.FollowerId, uf.FollowingId })
                .IsUnique();

            // Configure cascade delete for projects
            builder.Entity<Project>()
                .HasOne(p => p.Author)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure cascade delete for user follows
            builder.Entity<UserFollow>()
                .HasOne(uf => uf.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(uf => uf.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollow>()
                .HasOne(uf => uf.Following)
                .WithMany(u => u.Followers)
                .HasForeignKey(uf => uf.FollowingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure message relationships
            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany()
                .HasForeignKey(m => m.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 
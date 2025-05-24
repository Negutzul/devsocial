using System.ComponentModel.DataAnnotations;

namespace DevSocial.API.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ProjectUrl { get; set; }
        public string ImageUrl { get; set; }
        public string[] Technologies { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string AuthorId { get; set; }
        public string AuthorDisplayName { get; set; }
    }

    public class CreateProjectDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public string ProjectUrl { get; set; }

        public string ImageUrl { get; set; }

        public string[] Technologies { get; set; }
    }

    public class UpdateProjectDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public string ProjectUrl { get; set; }

        public string ImageUrl { get; set; }

        public string[] Technologies { get; set; }
    }
} 
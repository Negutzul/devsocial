using System.Threading.Tasks;

namespace DevSocial.API.Services
{
    public interface IDeploymentService
    {
        Task<DeploymentResult> DeployProject(string githubUrl, string dockerfile);
        Task<string> GetContainerLogs(string containerId);
    }

    public class DeploymentResult
    {
        public string ContainerId { get; set; }
        public string Status { get; set; }
        public string Url { get; set; }
        public string Error { get; set; }
    }
} 
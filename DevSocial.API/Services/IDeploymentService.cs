using System.Threading.Tasks;

namespace DevSocial.API.Services
{
    public interface IDeploymentService
    {
        Task<DeploymentResult> DeployProject(string githubUrl, string dockerfile);
        Task<string> GetContainerLogs(string containerId);
        Task<CommandResult> ExecuteCommand(string containerId, string command);
    }

    public class DeploymentResult
    {
        public string ContainerId { get; set; }
        public string Status { get; set; }
        public string Url { get; set; }
        public string Error { get; set; }
    }

    public class CommandResult
    {
        public string Output { get; set; }
        public string Error { get; set; }
        public int ExitCode { get; set; }
    }
} 
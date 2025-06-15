using DevSocial.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace DevSocial.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeploymentController : ControllerBase
    {
        private readonly IDeploymentService _deploymentService;

        public DeploymentController(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        [HttpPost("deploy")]
        public async Task<ActionResult<DeploymentResult>> DeployProject(DeployProjectRequest request)
        {
            var result = await _deploymentService.DeployProject(
                request.GithubUrl,
                request.Dockerfile,
                request.PortMappings
            );
            return Ok(result);
        }

        [HttpGet("logs/{containerId}")]
        public async Task<IActionResult> GetLogs(string containerId)
        {
            try
            {
                var logs = await _deploymentService.GetContainerLogs(containerId);
                return Ok(new { logs });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("execute/{containerId}")]
        public async Task<IActionResult> ExecuteCommand(string containerId, [FromBody] CommandRequest request)
        {
            try
            {
                var result = await _deploymentService.ExecuteCommand(containerId, request.Command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class DeployProjectRequest
    {
        public string GithubUrl { get; set; } = string.Empty;
        public string Dockerfile { get; set; } = string.Empty;
        public Dictionary<string, string> PortMappings { get; set; } = new();
    }

    public class CommandRequest
    {
        public string Command { get; set; }
    }
} 
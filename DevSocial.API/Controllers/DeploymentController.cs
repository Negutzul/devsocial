using DevSocial.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

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
        public async Task<IActionResult> Deploy([FromBody] DeploymentRequest request)
        {
            try
            {
                var result = await _deploymentService.DeployProject(request.GithubUrl, request.Dockerfile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class DeploymentRequest
    {
        public string GithubUrl { get; set; }
        public string Dockerfile { get; set; }
    }
} 
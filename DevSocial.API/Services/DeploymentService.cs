using System;
using System.IO;
using System.Threading.Tasks;
using Docker.DotNet;
using Docker.DotNet.Models;
using LibGit2Sharp;
using DevSocial.API.Extensions;
using Microsoft.Extensions.Configuration;
using System.Threading;
using System.Linq;
using System.Collections.Generic;
using System.Diagnostics;

namespace DevSocial.API.Services
{
    public class DeploymentService : IDeploymentService
    {
        private readonly string _baseDirectory;
        private readonly DockerClient _dockerClient;
        private readonly string _baseUrl;

        public DeploymentService(IConfiguration configuration)
        {
            try
            {
                // Initialize Docker client with Windows authentication
                var config = new DockerClientConfiguration(
                    new Uri("npipe://./pipe/docker_engine")
                );
                _dockerClient = config.CreateClient();

                // Create base directory for deployments
                _baseDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Deployments");
                if (!Directory.Exists(_baseDirectory))
                {
                    Directory.CreateDirectory(_baseDirectory);
                }

                // Get base URL from configuration
                _baseUrl = configuration["DeploymentSettings:BaseUrl"] ?? "https://devsocial.com";
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to initialize deployment service. Make sure Docker is running.", ex);
            }
        }

        public async Task<DeploymentResult> DeployProject(string githubUrl, string dockerfile)
        {
            string projectPath = null;
            string containerId = null;

            try
            {
                // Create a unique directory for this deployment
                var deploymentId = Guid.NewGuid().ToString();
                projectPath = Path.Combine(_baseDirectory, deploymentId);
                Directory.CreateDirectory(projectPath);

                // Clone the repository
                try
                {
                    CloneRepository(githubUrl, projectPath);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to clone repository: {ex.Message}");
                }

                // Write the Dockerfile
                try
                {
                    File.WriteAllText(Path.Combine(projectPath, "Dockerfile"), dockerfile);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to write Dockerfile: {ex.Message}");
                }

                // Build and run the Docker container
                try
                {
                    containerId = await BuildAndRunContainer(projectPath, deploymentId);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to build or run container: {ex.Message}");
                }

                return new DeploymentResult
                {
                    ContainerId = containerId,
                    Status = "Running",
                    Url = $"{_baseUrl}/deployments/{deploymentId}"
                };
            }
            catch (Exception ex)
            {
                // Cleanup on failure
                if (containerId != null)
                {
                    try
                    {
                        await _dockerClient.Containers.StopContainerAsync(containerId, new ContainerStopParameters());
                        await _dockerClient.Containers.RemoveContainerAsync(containerId, new ContainerRemoveParameters());
                    }
                    catch { /* Ignore cleanup errors */ }
                }

                if (projectPath != null && Directory.Exists(projectPath))
                {
                    try
                    {
                        Directory.Delete(projectPath, true);
                    }
                    catch { /* Ignore cleanup errors */ }
                }

                return new DeploymentResult
                {
                    Status = "Failed",
                    Error = ex.Message
                };
            }
        }

        private void CloneRepository(string url, string path)
        {
            var cloneOptions = new CloneOptions
            {
                Checkout = true,
                FetchOptions = new FetchOptions()
            };

            Repository.Clone(url, path, cloneOptions);
        }

        private async Task<string> BuildAndRunContainer(string projectPath, string deploymentId)
        {
            // Read exposed ports from Dockerfile
            var dockerfilePath = Path.Combine(projectPath, "Dockerfile");
            var exposedPorts = GetExposedPortsFromDockerfile(dockerfilePath);
            
            // Build the Docker image
            var buildParams = new ImageBuildParameters
            {
                Dockerfile = "./Dockerfile",
                Tags = new[] { $"devsocial-{deploymentId}:latest" },
                Remove = true
            };

            try
            {
                // Create a temporary directory for the build context
                var buildContextPath = Path.Combine(projectPath, "build-context");
                if (Directory.Exists(buildContextPath))
                {
                    Directory.Delete(buildContextPath, true);
                }
                Directory.CreateDirectory(buildContextPath);

                // Write the Dockerfile content directly
                var dockerfileContent = @"FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD [""npm"", ""start""]";
                
                var newDockerfilePath = Path.Combine(buildContextPath, "Dockerfile");
                File.WriteAllText(newDockerfilePath, dockerfileContent);
                Console.WriteLine($"Dockerfile content written to: {newDockerfilePath}");

                // Verify Dockerfile exists and has content
                if (!File.Exists(newDockerfilePath))
                {
                    throw new Exception($"Dockerfile was not created at {newDockerfilePath}");
                }
                var dockerfileContentCheck = File.ReadAllText(newDockerfilePath);
                Console.WriteLine($"Dockerfile content verification: {dockerfileContentCheck.Length} characters");

                // Copy the Angular project files to the build context
                var srcPath = Path.Combine(projectPath, "src");
                if (Directory.Exists(srcPath))
                {
                    CopyDirectory(srcPath, Path.Combine(buildContextPath, "src"));
                }

                var publicPath = Path.Combine(projectPath, "public");
                if (Directory.Exists(publicPath))
                {
                    CopyDirectory(publicPath, Path.Combine(buildContextPath, "public"));
                }

                // Copy all necessary configuration files
                var configFiles = new[] { "package.json", "package-lock.json", "angular.json", "tsconfig.json", "tsconfig.app.json", "tsconfig.spec.json" };
                foreach (var file in configFiles)
                {
                    var sourceFile = Path.Combine(projectPath, file);
                    if (File.Exists(sourceFile))
                    {
                        File.Copy(sourceFile, Path.Combine(buildContextPath, file), true);
                    }
                }

                // List all files in build context for verification
                Console.WriteLine("Files in build context:");
                foreach (var file in Directory.GetFiles(buildContextPath, "*", SearchOption.AllDirectories))
                {
                    Console.WriteLine($"- {file}");
                }

                // Create tar archive using the built-in method
                using (var buildContext = new DirectoryInfo(buildContextPath).CreateTarArchive())
                {
                    Console.WriteLine("Starting Docker build...");
                    await _dockerClient.Images.BuildImageFromDockerfileAsync(
                        buildParams,
                        buildContext,
                        null,
                        null,
                        new Progress<JSONMessage>(message => 
                        {
                            Console.WriteLine($"Docker build message: {message.Status}");
                            if (message.Error != null)
                            {
                                Console.WriteLine($"Docker build error: {message.Error}");
                            }
                        }),
                        CancellationToken.None
                    );
                    Console.WriteLine("Docker build completed successfully");
                }
            }
            catch (DockerApiException ex)
            {
                Console.WriteLine($"Docker API Exception: {ex.Message}");
                Console.WriteLine($"Response Body: {ex.ResponseBody}");
                throw new Exception($"Docker build failed: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Exception: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
            finally
            {
                // Clean up build context
                try
                {
                    var buildContextPath = Path.Combine(projectPath, "build-context");
                    if (Directory.Exists(buildContextPath))
                    {
                        Directory.Delete(buildContextPath, true);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error cleaning up build context: {ex.Message}");
                }
            }

            // Create and start the container
            var containerConfig = new CreateContainerParameters
            {
                Image = $"devsocial-{deploymentId}:latest",
                Name = $"devsocial-{deploymentId}",
                ExposedPorts = exposedPorts.ToDictionary(p => p, _ => default(EmptyStruct)),
                HostConfig = new HostConfig
                {
                    PortBindings = exposedPorts.ToDictionary(
                        p => p,
                        p => (IList<PortBinding>)new List<PortBinding> { new PortBinding { HostPort = p } }
                    )
                }
            };

            var container = await _dockerClient.Containers.CreateContainerAsync(containerConfig);
            await _dockerClient.Containers.StartContainerAsync(container.ID, new ContainerStartParameters());

            return container.ID;
        }

        private List<string> GetExposedPortsFromDockerfile(string dockerfilePath)
        {
            var exposedPorts = new List<string>();
            var dockerfileLines = File.ReadAllLines(dockerfilePath);
            
            foreach (var line in dockerfileLines)
            {
                if (line.TrimStart().StartsWith("EXPOSE", StringComparison.OrdinalIgnoreCase))
                {
                    var ports = line.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                        .Skip(1) // Skip the "EXPOSE" keyword
                        .SelectMany(p => p.Split('/')) // Handle port/protocol format
                        .Where(p => int.TryParse(p, out _)) // Only take numeric ports
                        .ToList();
                    
                    exposedPorts.AddRange(ports);
                }
            }

            // Default to 8080 if no ports are exposed
            return exposedPorts.Any() ? exposedPorts : new List<string> { "8080" };
        }

        private void CopyDirectory(string sourceDir, string destinationDir)
        {
            Directory.CreateDirectory(destinationDir);

            foreach (var file in Directory.GetFiles(sourceDir))
            {
                var fileName = Path.GetFileName(file);
                var destFile = Path.Combine(destinationDir, fileName);
                File.Copy(file, destFile, true);
            }

            foreach (var dir in Directory.GetDirectories(sourceDir))
            {
                var dirName = Path.GetFileName(dir);
                var destDir = Path.Combine(destinationDir, dirName);
                CopyDirectory(dir, destDir);
            }
        }

        public async Task<string> GetContainerLogs(string containerId)
        {
            try
            {
                var logStream = await _dockerClient.Containers.GetContainerLogsAsync(
                    containerId,
                    new ContainerLogsParameters
                    {
                        ShowStdout = true,
                        ShowStderr = true,
                        Timestamps = true,
                        Follow = false
                    });

                using var reader = new StreamReader(logStream);
                return await reader.ReadToEndAsync();
            }
            catch (DockerApiException ex)
            {
                throw new Exception($"Failed to get container logs: {ex.Message}");
            }
        }

        public async Task<CommandResult> ExecuteCommand(string containerId, string command)
        {
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = $"exec {containerId} /bin/bash -c \"{command.Replace("\"", "\\\"")}\"",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                var output = await process.StandardOutput.ReadToEndAsync();
                var error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                return new CommandResult
                {
                    Output = output,
                    Error = error,
                    ExitCode = process.ExitCode
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to execute command in container: {ex.Message}");
            }
        }
    }
} 
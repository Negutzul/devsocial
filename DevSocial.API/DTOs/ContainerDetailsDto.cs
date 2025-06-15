namespace DevSocial.API.DTOs;

public class ContainerDetailsDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public Dictionary<string, string> PortMappings { get; set; } = new();
    public Dictionary<string, string> Networks { get; set; } = new();
    public string Command { get; set; } = string.Empty;
    public Dictionary<string, string> Labels { get; set; } = new();
} 
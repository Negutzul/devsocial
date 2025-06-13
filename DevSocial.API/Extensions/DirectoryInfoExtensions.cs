using System.Diagnostics;
using System.IO;

namespace DevSocial.API.Extensions
{
    public static class DirectoryInfoExtensions
    {
        public static Stream CreateTarArchive(this DirectoryInfo directory)
        {
            var tempFile = Path.GetTempFileName();
            var startInfo = new ProcessStartInfo
            {
                FileName = "tar",
                Arguments = $"-czf \"{tempFile}\" -C \"{directory.FullName}\" .",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            using (var process = Process.Start(startInfo))
            {
                process.WaitForExit();
                if (process.ExitCode != 0)
                {
                    var error = process.StandardError.ReadToEnd();
                    throw new Exception($"Failed to create tar archive: {error}");
                }
            }

            // Verify the tar file exists and has content
            if (!File.Exists(tempFile) || new FileInfo(tempFile).Length == 0)
            {
                throw new Exception("Failed to create tar archive: File is empty or does not exist");
            }

            var memoryStream = new MemoryStream();
            using (var fileStream = File.OpenRead(tempFile))
            {
                fileStream.CopyTo(memoryStream);
            }
            File.Delete(tempFile);
            memoryStream.Position = 0;
            return memoryStream;
        }
    }
} 
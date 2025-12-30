using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using JewelryStore.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace JewelryStore.Services
{
    public interface ICloudinaryService
    {
        Task<string> UploadAsync(IFormFile file, CancellationToken cancellationToken = default);
    }

    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinaryOptions _options;

        public CloudinaryService(IOptions<CloudinaryOptions> options)
        {
            _options = options.Value;
            var account = new Account(_options.CloudName, _options.ApiKey, _options.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadAsync(IFormFile file, CancellationToken cancellationToken = default)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty");
            }

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = _options.Folder,
                PublicId = Path.GetFileNameWithoutExtension(Path.GetRandomFileName())
            };

            var result = await _cloudinary.UploadAsync(uploadParams, cancellationToken);
            if (result.StatusCode is not System.Net.HttpStatusCode.OK and not System.Net.HttpStatusCode.Created)
            {
                throw new InvalidOperationException($"Cloudinary upload failed: {result.Error?.Message ?? "unknown error"}");
            }

            return result.SecureUrl?.ToString() ?? result.Url?.ToString() ?? string.Empty;
        }
    }
}

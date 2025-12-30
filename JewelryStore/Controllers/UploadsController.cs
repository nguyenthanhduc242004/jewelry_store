using JewelryStore.Services;
using Microsoft.AspNetCore.Mvc;

namespace JewelryStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadsController : ControllerBase
    {
        private readonly ICloudinaryService _cloudinary;

        public UploadsController(ICloudinaryService cloudinary)
        {
            _cloudinary = cloudinary;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
        public async Task<IActionResult> Upload(IFormFile file, CancellationToken cancellationToken)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "File is required" });
            }

            try
            {
                var url = await _cloudinary.UploadAsync(file, cancellationToken);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to upload file", details = ex.Message });
            }
        }
    }
}


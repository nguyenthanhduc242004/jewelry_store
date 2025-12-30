using JewelryStore.Data;
using JewelryStore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JewelryStore.Controllers
{
    [ApiController]
    [Route("api/products/{productId:int}/images")]
    public class ProductImagesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IProductImageService _productImageService;

        public ProductImagesController(AppDbContext db, IProductImageService productImageService)
        {
            _db = db;
            _productImageService = productImageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductImage>>> GetAll([FromRoute] int productId)
        {
            try
            {
                var items = await _productImageService.GetAllByProductIdAsync(productId);
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching product images" });
            }
        }

        [HttpGet("{imageOrder:int}")]
        public async Task<ActionResult<ProductImage>> GetById([FromRoute] int productId, [FromRoute] int imageOrder)
        {
            try
            {
                var item = await _productImageService.GetByProductAndOrderAsync(productId, imageOrder);
                if (item == null) return NotFound(new { error = "Product image not found" });
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching product image" });
            }
        }

        public record CreateImageDto(int ImageOrder, string ImageUrl);
        public record UpdateImageDto(string ImageUrl);

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int productId, [FromBody] CreateImageDto dto)
        {
            try
            {
                var exists = await _db.ProductImages.AnyAsync(i => i.ProductId == productId && i.ImageOrder == dto.ImageOrder);
                if (exists) return BadRequest(new { error = "Product image already exists" });

                var model = new ProductImage
                {
                    ProductId = productId,
                    ImageOrder = dto.ImageOrder,
                    ImageUrl = dto.ImageUrl
                };
                _db.ProductImages.Add(model);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { productId, imageOrder = dto.ImageOrder }, model);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error creating product image" });
            }
        }

        [HttpPut("{imageOrder:int}")]
        public async Task<IActionResult> Update([FromRoute] int productId, [FromRoute] int imageOrder, [FromBody] UpdateImageDto dto)
        {
            try
            {
                var item = await _db.ProductImages.FirstOrDefaultAsync(i => i.ProductId == productId && i.ImageOrder == imageOrder);
                if (item == null) return NotFound(new { error = "Product image not found" });
                item.ImageUrl = dto.ImageUrl;
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error updating product image" });
            }
        }

        [HttpDelete("{imageOrder:int}")]
        public async Task<IActionResult> Delete([FromRoute] int productId, [FromRoute] int imageOrder)
        {
            try
            {
                var item = await _db.ProductImages.FirstOrDefaultAsync(i => i.ProductId == productId && i.ImageOrder == imageOrder);
                if (item == null) return NotFound(new { error = "Product image not found" });
                _db.ProductImages.Remove(item);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error deleting product image" });
            }
        }
    }
}
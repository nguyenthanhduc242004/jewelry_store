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
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly AppDbContext _db;
        public ProductsController(IProductService productService, AppDbContext db)
        {
            _productService = productService;
            _db = db;
        }

        public record ProductPreviewDto(
            int Id,
            string Name,
            string Material,
            string? ImageUrl,
            string CategoryName,
            decimal Price,
            int Quantity
        );

        [HttpGet("preview")]
        public async Task<ActionResult<IEnumerable<ProductPreviewDto>>> GetPreviews([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var items = await _productService.GetProductPreviewsAsync(skip, take);
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching product previews" });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var items = await _productService.GetAllProductsAsync(skip, take);
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching products" });
            }
        }

        public record ProductGemstoneDto(int Id, string Name, float Weight, string? Size, string? Color);

        public record ProductDetailDto(
            int Id,
            string Name,
            string Material,
            string? Description,
            decimal Price,
            bool Status,
            int CategoryId,
            string CategoryName,
            int Quantity,
            IEnumerable<ProductGemstoneDto> Gemstones
        );

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDetailDto>> GetById([FromRoute] int id)
        {
            try
            {
                var item = await _productService.GetProductDetailByIdAsync(id);
                if (item == null) return NotFound(new { error = "product not found" });
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching product" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product model)
        {
            try
            {
                _db.Products.Add(model);
                await _db.SaveChangesAsync();

                var existingInventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == model.Id);
                if (existingInventory == null)
                {
                    _db.Inventory.Add(new Inventory { ProductId = model.Id, Quantity = 0 });
                    await _db.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error creating product", details = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Product model)
        {
            try
            {
                var exists = await _db.Products.FirstOrDefaultAsync(c => c.Id == id);
                if (exists == null) return NotFound(new { error = "product not found" });

                exists.Name = model.Name;
                exists.Material = model.Material;
                exists.Description = model.Description;
                exists.Price = model.Price;
                exists.Status = model.Status;
                exists.CategoryId = model.CategoryId;

                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error updating product" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var item = await _db.Products.FirstOrDefaultAsync(c => c.Id == id);
                if (item == null) return NotFound(new { error = "product not found" });
                _db.Products.Remove(item);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error deleting product" });
            }
        }
    }
}
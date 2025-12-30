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
    public class GemstonesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<GemstonesController> _logger;
        private readonly IGemstoneService _gemstoneService;

        public GemstonesController(AppDbContext db, ILogger<GemstonesController> logger, IGemstoneService gemstoneService)
        {
            _db = db;
            _logger = logger;
            _gemstoneService = gemstoneService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gemstone>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var items = await _gemstoneService.GetAllAsync(skip, take);
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching gemstones" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Gemstone>> GetById([FromRoute] int id)
        {
            try
            {
                var item = await _gemstoneService.GetByIdAsync(id);
                if (item == null) return NotFound(new { error = "gemstone not found" });
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching gemstone" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateGemstoneDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    return BadRequest(new { error = "Gemstone name is required" });
                }

                if (dto.Weight <= 0)
                {
                    return BadRequest(new { error = "Gemstone weight must be greater than 0" });
                }

                // Verify product exists
                var productExists = await _db.Products.AnyAsync(p => p.Id == dto.ProductId);
                if (!productExists)
                {
                    return BadRequest(new { error = $"Product with ID {dto.ProductId} does not exist" });
                }

                var gemstone = new Gemstone
                {
                    ProductId = dto.ProductId,
                    Name = dto.Name.Trim(),
                    Weight = dto.Weight,
                    Size = dto.Size?.Trim(),
                    Color = dto.Color?.Trim()
                };

                _db.Gemstones.Add(gemstone);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = gemstone.Id }, gemstone);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database update error creating gemstone");
                var innerMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                return StatusCode(500, new { error = "Database error creating gemstone", details = innerMessage });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating gemstone");
                return StatusCode(500, new { error = "error creating gemstone", details = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] CreateGemstoneDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Name))
                {
                    return BadRequest(new { error = "Gemstone name is required" });
                }

                if (dto.Weight <= 0)
                {
                    return BadRequest(new { error = "Gemstone weight must be greater than 0" });
                }

                var exists = await _db.Gemstones.FirstOrDefaultAsync(c => c.Id == id);
                if (exists == null) return NotFound(new { error = "gemstone not found" });

                exists.Name = dto.Name.Trim();
                exists.Weight = dto.Weight;
                exists.Size = dto.Size?.Trim();
                exists.Color = dto.Color?.Trim();
                exists.ProductId = dto.ProductId;

                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database update error updating gemstone");
                var innerMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                return StatusCode(500, new { error = "Database error updating gemstone", details = innerMessage });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating gemstone");
                return StatusCode(500, new { error = "error updating gemstone", details = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var item = await _db.Gemstones.FirstOrDefaultAsync(c => c.Id == id);
                if (item == null) return NotFound(new { error = "gemstone not found" });
                _db.Gemstones.Remove(item);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database update error deleting gemstone");
                var innerMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                return StatusCode(500, new { error = "Database error deleting gemstone", details = innerMessage });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting gemstone");
                return StatusCode(500, new { error = "error deleting gemstone", details = ex.InnerException?.Message ?? ex.Message });
            }
        }
    }
}
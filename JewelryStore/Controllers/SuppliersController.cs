using JewelryStore.Data;
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
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public SuppliersController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (take <= 0 || take > 200) take = 50;
                var items = await _db.Suppliers.AsNoTracking().OrderBy(c => c.Id).Skip(skip).Take(take).ToListAsync();
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching suppliers" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Supplier>> GetById([FromRoute] int id)
        {
            try
            {
                var item = await _db.Suppliers.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                if (item == null) return NotFound(new { error = "supplier not found" });
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching supplier" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Supplier model)
        {
            try
            {
                _db.Suppliers.Add(model);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error creating supplier" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Supplier model)
        {
            try
            {
                var exists = await _db.Suppliers.FirstOrDefaultAsync(c => c.Id == id);
                if (exists == null) return NotFound(new { error = "supplier not found" });

                exists.Name = model.Name;
                exists.Address = model.Address;
                exists.Phone = model.Phone;
                exists.Status = model.Status;

                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error updating supplier" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var item = await _db.Suppliers.FirstOrDefaultAsync(c => c.Id == id);
                if (item == null) return NotFound(new { error = "supplier not found" });
                _db.Suppliers.Remove(item);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error deleting supplier" });
            }
        }
    }
}
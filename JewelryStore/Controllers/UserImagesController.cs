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
    [Route("api/users/{userId:int}/images")]
    public class UserImagesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public UserImagesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<UserImage>> Get([FromRoute] int userId)
        {
            try
            {
                var item = await _db.UserImages
                    .AsNoTracking()
                    .FirstOrDefaultAsync(i => i.UserId == userId);
                if (item == null) return NotFound(new { error = "User image not found" });
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error fetching user image" });
            }
        }

        public record CreateUserImageDto(string ImageUrl);
        public record UpdateUserImageDto(string ImageUrl);

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int userId, [FromBody] CreateUserImageDto dto)
        {
            try
            {
                var exists = await _db.UserImages.AnyAsync(i => i.UserId == userId);
                if (exists) return BadRequest(new { error = "User image already exists" });

                var model = new UserImage
                {
                    UserId = userId,
                    ImageUrl = dto.ImageUrl
                };

                _db.UserImages.Add(model);
                await _db.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { userId }, model);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error creating user image" });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromRoute] int userId, [FromBody] UpdateUserImageDto dto)
        {
            try
            {
                var item = await _db.UserImages.FirstOrDefaultAsync(i => i.UserId == userId);
                if (item == null)
                {
                    var created = new UserImage
                    {
                        UserId = userId,
                        ImageUrl = dto.ImageUrl
                    };
                    _db.UserImages.Add(created);
                    await _db.SaveChangesAsync();
                    return CreatedAtAction(nameof(Get), new { userId }, created);
                }
                else
                {
                    item.ImageUrl = dto.ImageUrl;
                    await _db.SaveChangesAsync();
                    return NoContent();
                }
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error updating user image" });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromRoute] int userId)
        {
            try
            {
                var item = await _db.UserImages.FirstOrDefaultAsync(i => i.UserId == userId);
                if (item == null) return NotFound(new { error = "User image not found" });

                _db.UserImages.Remove(item);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error deleting user image" });
            }
        }
    }
}

using Microsoft.AspNetCore.Identity;
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
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole<int>> _roles;
        public RolesController(RoleManager<IdentityRole<int>> roles) => _roles = roles;

        public record RoleDto(int Id, string Name);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (take <= 0 || take > 200) take = 50;
                var list = await _roles.Roles
                    .AsNoTracking()
                    .OrderBy(r => r.Id)
                    .Skip(skip)
                    .Take(take)
                    .Select(r => new RoleDto(r.Id, r.Name ?? string.Empty))
                    .ToListAsync();
                return Ok(list);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching roles" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<RoleDto>> GetById([FromRoute] int id)
        {
            try
            {
                var role = await _roles.Roles.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
                if (role == null) return NotFound(new { error = "role not found" });
                return Ok(new RoleDto(role.Id, role.Name ?? string.Empty));
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching role" });
            }
        }
    }
}
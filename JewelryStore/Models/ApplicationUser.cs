using Microsoft.AspNetCore.Identity;
using System;

namespace JewelryStore.Data
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string FullName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public DateTime? Birthday { get; set; }
        public bool Status { get; set; } = true;
    }
}

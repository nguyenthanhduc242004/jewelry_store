using System;

namespace JewelryStore.Data
{
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string Status { get; set; } = "active"; // active, confirmed, abandoned

        public ApplicationUser? User { get; set; }
    }
}

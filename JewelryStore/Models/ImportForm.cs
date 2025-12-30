using System;

namespace JewelryStore.Data
{
    public class ImportForm
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public int? StaffId { get; set; }
        public DateTime DateCreated { get; set; }
        public decimal TotalPrice { get; set; }

        public Supplier? Supplier { get; set; }
        public ApplicationUser? Staff { get; set; }
    }
}
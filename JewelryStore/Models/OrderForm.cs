using System;

namespace JewelryStore.Data
{
    public class OrderForm
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? StaffId { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime DateCreated { get; set; }
        public string Status { get; set; } = "0";
        public string ShippingAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;

        public ApplicationUser? User { get; set; }
        public ApplicationUser? Staff { get; set; }
    }
}
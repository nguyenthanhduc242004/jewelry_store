namespace JewelryStore.Data
{
    public class UserImage
    {
        public int UserId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        public ApplicationUser? User { get; set; }
    }
}

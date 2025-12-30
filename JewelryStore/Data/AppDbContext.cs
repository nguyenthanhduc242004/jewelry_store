using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JewelryStore.Data.Configurations;

namespace JewelryStore.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Gemstone> Gemstones => Set<Gemstone>();
        public DbSet<Inventory> Inventory => Set<Inventory>();
        public DbSet<OrderForm> Orders => Set<OrderForm>();
        public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<ImportForm> ImportForms => Set<ImportForm>();
        public DbSet<ImportDetail> ImportDetails => Set<ImportDetail>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<UserImage> UserImages => Set<UserImage>();
        public DbSet<ProductSummaryView> ProductSummaries => Set<ProductSummaryView>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply per-entity configuration classes
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            IdentityTablesConfiguration.ConfigureIdentityTables(modelBuilder);

            modelBuilder
                .Entity<ProductSummaryView>()
                .ToView("product_summary_view")
                .HasNoKey();
        }
    }
}
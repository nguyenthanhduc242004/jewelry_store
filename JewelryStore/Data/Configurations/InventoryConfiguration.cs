using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
    {
        public void Configure(EntityTypeBuilder<Inventory> entity)
        {
            entity.ToTable("inventory");
            entity.HasKey(i => i.ProductId).HasName("PK_inventory");
            entity.Property(i => i.ProductId).HasColumnName("product_id");
            entity.Property(i => i.Quantity).HasColumnName("quantity").IsRequired();

            entity.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .HasConstraintName("FK_inventory_products_product_id")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
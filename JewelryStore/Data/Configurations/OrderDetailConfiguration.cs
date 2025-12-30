using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class OrderDetailConfiguration : IEntityTypeConfiguration<OrderDetail>
    {
        public void Configure(EntityTypeBuilder<OrderDetail> entity)
        {
            entity.ToTable("order_details");
            entity.HasKey(od => new { od.OrderId, od.ProductId }).HasName("PK_order_details");

            entity.Property(od => od.OrderId).HasColumnName("order_id");
            entity.Property(od => od.ProductId).HasColumnName("product_id");
            entity.Property(od => od.Quantity).HasColumnName("quantity").IsRequired();
            entity.Property(od => od.PriceAtSale).HasColumnName("price_at_sale").HasColumnType("numeric(18,2)").IsRequired();
            entity.Property(od => od.TotalPrice).HasColumnName("total_price").HasColumnType("numeric(18,2)").IsRequired();

            entity.HasOne(od => od.Order)
                .WithMany()
                .HasForeignKey(od => od.OrderId)
                .HasConstraintName("FK_order_details_orders_order_id")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(od => od.Product)
                .WithMany()
                .HasForeignKey(od => od.ProductId)
                .HasConstraintName("FK_order_details_products_product_id")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(od => od.OrderId).HasDatabaseName("IX_order_details_order_id");
            entity.HasIndex(od => od.ProductId).HasDatabaseName("IX_order_details_product_id");
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> entity)
        {
            entity.ToTable("product_images");
            entity.HasKey(pi => new { pi.ProductId, pi.ImageOrder }).HasName("PK_product_images");

            entity.Property(pi => pi.ProductId).HasColumnName("product_id");
            entity.Property(pi => pi.ImageOrder).HasColumnName("image_order");
            entity.Property(pi => pi.ImageUrl).HasColumnName("image_url").IsRequired();

            entity.HasOne(pi => pi.Product)
                .WithMany()
                .HasForeignKey(pi => pi.ProductId)
                .HasConstraintName("FK_product_images_products_product_id")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(pi => pi.ProductId).HasDatabaseName("IX_product_images_product_id");
        }
    }
}
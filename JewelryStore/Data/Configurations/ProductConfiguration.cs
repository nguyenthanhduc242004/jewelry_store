using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> entity)
        {
            entity.ToTable("products");
            entity.HasKey(p => p.Id).HasName("PK_products");
            entity.Property(p => p.Id).HasColumnName("id");
            entity.Property(p => p.CategoryId).HasColumnName("category_id").IsRequired();
            entity.Property(p => p.Name).HasColumnName("name").IsRequired();
            entity.Property(p => p.Material).HasColumnName("material").IsRequired();
            entity.Property(p => p.Description).HasColumnName("description");
            entity.Property(p => p.Price).HasColumnName("price").HasColumnType("numeric(18,2)").IsRequired();
            entity.Property(p => p.Status).HasColumnName("status").HasDefaultValue(true).IsRequired();

            entity.HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .HasConstraintName("FK_products_categories_category_id")
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
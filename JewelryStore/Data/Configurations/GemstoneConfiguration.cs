using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class GemstoneConfiguration : IEntityTypeConfiguration<Gemstone>
    {
        public void Configure(EntityTypeBuilder<Gemstone> entity)
        {
            entity.ToTable("gemstones");
            entity.HasKey(g => g.Id).HasName("PK_gemstones");
            entity.Property(g => g.Id).HasColumnName("id").ValueGeneratedOnAdd();
            entity.Property(g => g.ProductId).HasColumnName("product_id").IsRequired();
            entity.Property(g => g.Name).HasColumnName("name").IsRequired();
            entity.Property(g => g.Weight).HasColumnName("weight");
            entity.Property(g => g.Size).HasColumnName("size");
            entity.Property(g => g.Color).HasColumnName("color");

            entity.HasOne(g => g.Product)
                .WithMany()
                .HasForeignKey(g => g.ProductId)
                .HasConstraintName("FK_gemstones_products_product_id")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
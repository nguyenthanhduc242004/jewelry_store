using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class ImportDetailConfiguration : IEntityTypeConfiguration<ImportDetail>
    {
        public void Configure(EntityTypeBuilder<ImportDetail> entity)
        {
            entity.ToTable("import_details");
            entity.HasKey(id => new { id.ImportId, id.ProductId }).HasName("PK_import_details");

            entity.Property(id => id.ImportId).HasColumnName("import_id");
            entity.Property(id => id.ProductId).HasColumnName("product_id");
            entity.Property(id => id.Quantity).HasColumnName("quantity").IsRequired();
            entity.Property(id => id.ImportPrice).HasColumnName("import_price").HasColumnType("numeric(18,2)").IsRequired();

            entity.HasOne(id => id.Import)
                .WithMany()
                .HasForeignKey(id => id.ImportId)
                .HasConstraintName("FK_import_details_import_forms_import_id")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(id => id.Product)
                .WithMany()
                .HasForeignKey(id => id.ProductId)
                .HasConstraintName("FK_import_details_products_product_id")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(id => id.ImportId).HasDatabaseName("IX_import_details_import_id");
            entity.HasIndex(id => id.ProductId).HasDatabaseName("IX_import_details_product_id");
        }
    }
}
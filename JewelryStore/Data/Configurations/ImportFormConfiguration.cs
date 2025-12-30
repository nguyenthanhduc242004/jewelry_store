using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class ImportFormConfiguration : IEntityTypeConfiguration<ImportForm>
    {
        public void Configure(EntityTypeBuilder<ImportForm> entity)
        {
            entity.ToTable("import_forms");
            entity.HasKey(i => i.Id).HasName("PK_import_forms");

            entity.Property(i => i.Id).HasColumnName("id");
            entity.Property(i => i.SupplierId).HasColumnName("supplier_id").IsRequired();
            entity.Property(i => i.StaffId).HasColumnName("staff_id");
            entity.Property(i => i.DateCreated).HasColumnName("date_created").IsRequired();
            entity.Property(i => i.TotalPrice).HasColumnName("total_price").HasColumnType("numeric(18,2)").IsRequired();

            entity.HasOne(i => i.Supplier)
                .WithMany()
                .HasForeignKey(i => i.SupplierId)
                .HasConstraintName("FK_import_forms_suppliers_supplier_id")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(i => i.Staff)
                .WithMany()
                .HasForeignKey(i => i.StaffId)
                .HasConstraintName("FK_import_forms_users_staff_id")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(i => i.SupplierId).HasDatabaseName("IX_import_forms_supplier_id");
            entity.HasIndex(i => i.StaffId).HasDatabaseName("IX_import_forms_staff_id");
        }
    }
}
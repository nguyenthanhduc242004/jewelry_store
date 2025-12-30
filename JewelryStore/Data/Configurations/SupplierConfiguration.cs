using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> entity)
        {
            entity.ToTable("suppliers");
            entity.HasKey(s => s.Id).HasName("PK_suppliers");
            entity.Property(s => s.Id).HasColumnName("id");
            entity.Property(s => s.Name).HasColumnName("name").IsRequired();
            entity.Property(s => s.Address).HasColumnName("address");
            entity.Property(s => s.Phone).HasColumnName("phone").IsRequired();
            entity.Property(s => s.Status).HasColumnName("status").HasDefaultValue(true).IsRequired();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class OrderFormConfiguration : IEntityTypeConfiguration<OrderForm>
    {
        public void Configure(EntityTypeBuilder<OrderForm> entity)
        {
            entity.ToTable("orders");
            entity.HasKey(o => o.Id).HasName("PK_orders");

            entity.Property(o => o.Id).HasColumnName("id");
            entity.Property(o => o.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(o => o.StaffId).HasColumnName("staff_id");
            entity.Property(o => o.TotalPrice).HasColumnName("total_price").HasColumnType("numeric(18,2)").IsRequired();
            entity.Property(o => o.DateCreated).HasColumnName("date_created").IsRequired();
            entity.Property(o => o.Status).HasColumnName("status").IsRequired();
            entity.Property(o => o.ShippingAddress).HasColumnName("shipping_address").IsRequired();
            entity.Property(o => o.PhoneNumber).HasColumnName("phone_number").IsRequired();

            entity.HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .HasConstraintName("FK_orders_users_user_id")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(o => o.Staff)
                .WithMany()
                .HasForeignKey(o => o.StaffId)
                .HasConstraintName("FK_orders_users_staff_id")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(o => o.UserId).HasDatabaseName("IX_orders_user_id");
            entity.HasIndex(o => o.StaffId).HasDatabaseName("IX_orders_staff_id");
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> entity)
        {
            entity.ToTable("users");

            entity.Property(u => u.Id).HasColumnName("id");
            entity.Property(u => u.FullName).HasColumnName("full_name").HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(100).IsRequired();
            entity.Property(u => u.PasswordHash).HasColumnName("password");
            entity.Property(u => u.PhoneNumber).HasColumnName("phone").HasMaxLength(15);
            entity.Property(u => u.Address).HasColumnName("address");
            entity.Property(u => u.Birthday).HasColumnName("birthday");
            entity.Property(u => u.Status).HasColumnName("status").HasDefaultValue(true).IsRequired();

            entity.Property(u => u.UserName).HasColumnName("username");
            entity.Property(u => u.NormalizedUserName).HasColumnName("normalized_username");
            entity.Property(u => u.NormalizedEmail).HasColumnName("normalized_email");
            entity.Property(u => u.EmailConfirmed).HasColumnName("email_confirmed");
            entity.Property(u => u.SecurityStamp).HasColumnName("security_stamp");
            entity.Property(u => u.ConcurrencyStamp).HasColumnName("concurrency_stamp");
            entity.Property(u => u.PhoneNumberConfirmed).HasColumnName("phone_confirmed");
            entity.Property(u => u.TwoFactorEnabled).HasColumnName("two_factor_enabled");
            entity.Property(u => u.LockoutEnd).HasColumnName("lockout_end");
            entity.Property(u => u.LockoutEnabled).HasColumnName("lockout_enabled");
            entity.Property(u => u.AccessFailedCount).HasColumnName("access_failed_count");

            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.PhoneNumber).IsUnique();
        }
    }
}
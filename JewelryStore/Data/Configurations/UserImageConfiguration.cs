using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JewelryStore.Data.Configurations
{
    public class UserImageConfiguration : IEntityTypeConfiguration<UserImage>
    {
        public void Configure(EntityTypeBuilder<UserImage> entity)
        {
            entity.ToTable("user_images");
            entity.HasKey(ui => ui.UserId).HasName("PK_user_images");

            entity.Property(ui => ui.UserId).HasColumnName("user_id");
            entity.Property(ui => ui.ImageUrl).HasColumnName("image_url").IsRequired();

            entity.HasOne(ui => ui.User)
                .WithMany()
                .HasForeignKey(ui => ui.UserId)
                .HasConstraintName("FK_user_images_users_user_id")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ui => ui.UserId).HasDatabaseName("IX_user_images_user_id");
        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Data.Configurations
{
    public static class IdentityTablesConfiguration
    {
        public static void ConfigureIdentityTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityRole<int>>().ToTable("roles");
            modelBuilder.Entity<IdentityRole<int>>().Property(r => r.Id).HasColumnName("id");
            modelBuilder.Entity<IdentityRole<int>>().Property(r => r.Name).HasColumnName("name");
            modelBuilder.Entity<IdentityRole<int>>().Property(r => r.NormalizedName).HasColumnName("normalized_name");
            modelBuilder.Entity<IdentityRole<int>>().Property(r => r.ConcurrencyStamp).HasColumnName("concurrency_stamp");

            modelBuilder.Entity<IdentityUserRole<int>>().ToTable("user_roles");
            modelBuilder.Entity<IdentityUserRole<int>>().Property(ur => ur.UserId).HasColumnName("user_id");
            modelBuilder.Entity<IdentityUserRole<int>>().Property(ur => ur.RoleId).HasColumnName("role_id");

            modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("user_claims");
            modelBuilder.Entity<IdentityUserClaim<int>>().Property(uc => uc.Id).HasColumnName("id");
            modelBuilder.Entity<IdentityUserClaim<int>>().Property(uc => uc.UserId).HasColumnName("user_id");

            modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("user_logins");
            modelBuilder.Entity<IdentityUserLogin<int>>().Property(ul => ul.UserId).HasColumnName("user_id");

            modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("role_claims");
            modelBuilder.Entity<IdentityRoleClaim<int>>().Property(rc => rc.Id).HasColumnName("id");
            modelBuilder.Entity<IdentityRoleClaim<int>>().Property(rc => rc.RoleId).HasColumnName("role_id");

            modelBuilder.Entity<IdentityUserToken<int>>().ToTable("user_tokens");
            modelBuilder.Entity<IdentityUserToken<int>>().Property(ut => ut.UserId).HasColumnName("user_id");
        }
    }
}
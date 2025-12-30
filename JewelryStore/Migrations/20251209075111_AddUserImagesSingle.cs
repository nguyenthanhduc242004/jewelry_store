using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewelryStore.Migrations
{
    /// <inheritdoc />
    public partial class AddUserImagesSingle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_images",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    image_url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_images", x => x.user_id);
                    table.ForeignKey(
                        name: "FK_user_images_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_images_user_id",
                table: "user_images",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_images");
        }
    }
}

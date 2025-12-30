using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewelryStore.Migrations
{
    /// <inheritdoc />
    public partial class AddImportDetailTotalPrice_RealColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalPrice",
                table: "import_details",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "import_details");
        }
    }
}

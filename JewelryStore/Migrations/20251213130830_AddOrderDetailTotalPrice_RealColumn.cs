using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewelryStore.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderDetailTotalPrice_RealColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "total_price",
                table: "order_details",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "total_price",
                table: "order_details");
        }
    }
}

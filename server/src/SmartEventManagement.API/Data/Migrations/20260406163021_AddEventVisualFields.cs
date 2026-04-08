using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartEventManagement.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEventVisualFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "attendee_count",
                schema: "public",
                table: "events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "category",
                schema: "public",
                table: "events",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                schema: "public",
                table: "events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "price_label",
                schema: "public",
                table: "events",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "rating",
                schema: "public",
                table: "events",
                type: "numeric(3,2)",
                precision: 3,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "review_count",
                schema: "public",
                table: "events",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "attendee_count",
                schema: "public",
                table: "events");

            migrationBuilder.DropColumn(
                name: "category",
                schema: "public",
                table: "events");

            migrationBuilder.DropColumn(
                name: "image_url",
                schema: "public",
                table: "events");

            migrationBuilder.DropColumn(
                name: "price_label",
                schema: "public",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rating",
                schema: "public",
                table: "events");

            migrationBuilder.DropColumn(
                name: "review_count",
                schema: "public",
                table: "events");
        }
    }
}

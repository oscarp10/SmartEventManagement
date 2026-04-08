using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartEventManagement.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEventAdminCommentRegistrationsOpen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "admin_comment",
                schema: "public",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "registrations_open",
                schema: "public",
                table: "events",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "admin_comment",
                schema: "public",
                table: "events");

            migrationBuilder.DropColumn(
                name: "registrations_open",
                schema: "public",
                table: "events");
        }
    }
}

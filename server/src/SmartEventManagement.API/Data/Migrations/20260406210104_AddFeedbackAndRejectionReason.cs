using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartEventManagement.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFeedbackAndRejectionReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "rejection_reason",
                schema: "public",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "feedback",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    event_id = table.Column<Guid>(type: "uuid", nullable: false),
                    attendee_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    comment = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    ProfileId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_feedback", x => x.id);
                    table.ForeignKey(
                        name: "FK_feedback_events_event_id",
                        column: x => x.event_id,
                        principalSchema: "public",
                        principalTable: "events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_feedback_profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalSchema: "public",
                        principalTable: "profiles",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_feedback_profiles_attendee_id",
                        column: x => x.attendee_id,
                        principalSchema: "public",
                        principalTable: "profiles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_feedback_attendee_id",
                schema: "public",
                table: "feedback",
                column: "attendee_id");

            migrationBuilder.CreateIndex(
                name: "IX_feedback_event_id_attendee_id",
                schema: "public",
                table: "feedback",
                columns: new[] { "event_id", "attendee_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_feedback_ProfileId",
                schema: "public",
                table: "feedback",
                column: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "feedback",
                schema: "public");

            migrationBuilder.DropColumn(
                name: "rejection_reason",
                schema: "public",
                table: "events");
        }
    }
}

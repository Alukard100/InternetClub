using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternetClub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUserActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvailableMinutes",
                table: "Users",
                newName: "AvailableSeconds");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "AvailableSeconds",
                table: "Users",
                newName: "AvailableMinutes");
        }
    }
}

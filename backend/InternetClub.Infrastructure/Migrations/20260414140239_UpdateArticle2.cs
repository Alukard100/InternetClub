using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternetClub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateArticle2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Published",
                table: "Articles",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Published",
                table: "Articles");
        }
    }
}

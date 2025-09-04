using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fracto_Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeInSpecialzation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SpecializationId",
                table: "Specializations",
                newName: "specializationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "specializationId",
                table: "Specializations",
                newName: "SpecializationId");
        }
    }
}

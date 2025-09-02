using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int userId { get; set; }

    [Required, StringLength(50)]
    public string? username { get; set; }

    [Required]
    public string? password { get; set; } // Store hashed password

    [Required, StringLength(20)]
    public string? role { get; set; } // "User" or "Admin"

    [StringLength(255)]
    public string? profileImagePath { get; set; }

    // Relationships
    public ICollection<Appointment>? appointments { get; set; }
    public ICollection<Rating>? ratings { get; set; }
}


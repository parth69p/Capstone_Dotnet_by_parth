using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Doctor
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int doctorId { get; set; }

    [Required, StringLength(100)]
    public string? name { get; set; }

    [Required]
    public int specializationId { get; set; }


    // Required relationship (many-to-one)
    [ForeignKey("specializationId")]
    public Specialization Specialization { get; set; } = null!;

    [Required, StringLength(100)]
    public string? city { get; set; }

    public double rating { get; set; }

    [StringLength(255)]
    public string? profileImagePath { get; set; }

    public ICollection<Appointment>? appointments { get; set; }
    public ICollection<Rating>? ratings { get; set; }
}

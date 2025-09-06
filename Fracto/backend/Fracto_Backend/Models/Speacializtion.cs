using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class Specialization
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int specializationId { get; set; }

    [Required, MaxLength(100)]
    public string? specializationName { get; set; }

    // Navigation property
    public ICollection<Doctor>? doctors { get; set; }
}

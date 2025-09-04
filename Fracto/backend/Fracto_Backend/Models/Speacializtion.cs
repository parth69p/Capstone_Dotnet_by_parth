using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class Specialization
{
    [Key]
    public int specializationId { get; set; }

    [Required, MaxLength(100)]
    public string? specializationName { get; set; }

    // Navigation
    public ICollection<Doctor>? doctors { get; set; }
}

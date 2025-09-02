using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class Appointment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int appointmentId { get; set; }


    [Required]
    public DateTime appointmentDate { get; set; }

    [Required, StringLength(50)]
    public string? timeSlot { get; set; }

    [Required, StringLength(20)]
    public string? status { get; set; } // "Booked", "Cancelled", etc.


    [Required]
    public int userId { get; set; }
    public User? user { get; set; }

    [Required]
    public int doctorId { get; set; }
    public Doctor? doctor { get; set; }

}

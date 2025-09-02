using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Rating
{
    [Key]
    public int ratingId { get; set; }

    [Range(1, 5)]
    public int ratingValue { get; set; }

    // Foreign Keys
    [Required, ForeignKey("Doctor")]
    public int doctorId { get; set; }
    public Doctor? doctor { get; set; }

    [Required, ForeignKey("User")]
    public int userId { get; set; }
    public User? user { get; set; }
}

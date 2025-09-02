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

        [Required, StringLength(100)]
        public string? city { get; set; }

        public double rating { get; set; }

        [StringLength(255)]
        public string? profileImagePath { get; set; }

        // Relationships
        public ICollection<Appointment>? appointments { get; set; }
        public ICollection<Rating>? ratings { get; set; }
    }

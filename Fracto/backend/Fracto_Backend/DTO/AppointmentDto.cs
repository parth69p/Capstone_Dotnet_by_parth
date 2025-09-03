using System;
using System.ComponentModel.DataAnnotations;

    // DTO for creating a new appointment
    public class CreateAppointmentDto
    {
        [Required]
        public int doctorId { get; set; }

        [Required]
        public DateTime appointmentDate { get; set; }

        [Required]
        public string timeSlot { get; set; } = string.Empty;
    }

    // DTO for displaying appointment details
    public class AppointmentDto
    {
        public int id { get; set; }
        public int userId { get; set; }
        public string userName { get; set; } = string.Empty;
        public int doctorId { get; set; }
        public string doctorName { get; set; } = string.Empty;
        public DateTime appointmentDate { get; set; }
        public string timeSlot { get; set; } = string.Empty;
        public string status { get; set; } = string.Empty;
    
}
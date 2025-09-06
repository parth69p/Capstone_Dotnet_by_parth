
    // DTO for returning doctor information to the client
    public class DoctorDto
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public string city { get; set; } = string.Empty;
        public double rating { get; set; }
        public string? profileImagePath { get; set; }
        public int specializationId { get; set; }
        public string specializationName { get; set; } = string.Empty;
    }

// DTO for creating a new doctor (Admin)
public class CreateDoctorDto
{
    public string name { get; set; } = string.Empty;
    public string city { get; set; } = string.Empty;
    public int specializationId { get; set; }

    public double rating { get; set; } = 4.2;
        
    }

    // DTO for updating a doctor (Admin)
    public class UpdateDoctorDto
    {
        public string name { get; set; } = string.Empty;
        public string city { get; set; } = string.Empty;
        public int specializationId { get; set; }
    }
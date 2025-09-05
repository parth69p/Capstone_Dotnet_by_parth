using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
[Route("api/[controller]")]
[ApiController]

public class AdminController : ControllerBase
{
    private readonly FractoDbContext _context;
    private readonly IFileService _fileService;

    public AdminController(FractoDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    //========================================= ADMIN SIDE =====================================
    // GET: api/Admin/users
    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        return await _context.Users
            .Select(u => new UserDto
            {
                id = u.userId,
                username = u.username,
                role = u.role,
                profileImagePath = u.profileImagePath
            })
            .ToListAsync();
    }

    // POST: api/Admin/users
    [HttpPost("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromForm] RegisterRequestByAdmin request, IFormFile? profileImage)
    {
        if (await _context.Users.AnyAsync(u => u.username == request.username))
            return BadRequest("Username already exists.");

        var user = new User
        {
            username = request.username,
            role = string.IsNullOrEmpty(request.role) ? "User" : request.role
        };

        var passwordHasher = new PasswordHasher<User>();
        user.password = passwordHasher.HashPassword(user, request.password);

        if (profileImage != null)
        {
            user.profileImagePath = await _fileService.SaveImageAsync(profileImage, "users");
        }

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User created successfully.", userId = user.userId });
    }

    // PUT: api/Admin/users/{id}
    [HttpPut("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromForm] UserDto userDto)
    {
        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null) return NotFound();

        existingUser.username = userDto.username ?? existingUser.username;
        existingUser.role = userDto.role ?? existingUser.role;
        existingUser.profileImagePath = userDto.profileImagePath ?? existingUser.profileImagePath;

        _context.Users.Update(existingUser);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Admin/users/{id}
    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        if (!string.IsNullOrEmpty(user.profileImagePath))
        {
            _fileService.DeleteImage(user.profileImagePath);
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    // ========================================= DOCTORS =========================================

    // GET: api/Admin/doctors
    [HttpGet("doctors")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<DoctorDto>>> GetAllDoctors()
    {
        return await _context.Doctors
            .Include(d => d.Specialization)
            .Select(d => new DoctorDto
            {
                id = d.doctorId,
                name = d.name ?? string.Empty,
                specializationId = d.specializationId,
                specializationName = d.Specialization != null ? d.Specialization.specializationName ?? string.Empty : "N/A",
                profileImagePath = d.profileImagePath
            })
            .ToListAsync();
    }

    // GET: api/Admin/doctors-list
    [HttpGet("doctors-list")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<DoctorDto>>> GetDoctors()
    {
        return await _context.Doctors
            .Include(d => d.Specialization)
            .Select(d => new DoctorDto
            {
                id = d.doctorId,
                name = d.name ?? string.Empty,
                city = d.city ?? string.Empty,
                rating = d.rating,
                profileImagePath = d.profileImagePath,
                specializationId = d.specializationId,
                specializationName = d.Specialization.specializationName ?? string.Empty
            })
            .ToListAsync();
    }

    // POST: api/Admin/doctors
    [HttpPost("doctors")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DoctorDto>> CreateDoctor([FromForm] CreateDoctorDto createDto, IFormFile? profileImage)
    {
        var doctor = new Doctor
        {
            name = createDto.name,
            city = createDto.city,
            specializationId = createDto.specializationId,
            rating = 0
        };

        if (profileImage != null)
        {
            doctor.profileImagePath = await _fileService.SaveImageAsync(profileImage, "doctors");
        }

        await _context.Doctors.AddAsync(doctor);
        await _context.SaveChangesAsync();

        await _context.Entry(doctor).Reference(d => d.Specialization).LoadAsync();

        var doctorDto = new DoctorDto
        {
            id = doctor.doctorId,
            name = doctor.name ?? string.Empty,
            city = doctor.city ?? string.Empty,
            rating = doctor.rating,
            profileImagePath = doctor.profileImagePath ?? string.Empty,
            specializationId = doctor.specializationId,
            specializationName = doctor.Specialization.specializationName ?? string.Empty
        };

        return CreatedAtAction(nameof(GetDoctors), new { id = doctor.doctorId }, doctorDto);
    }

    // PUT: api/Admin/doctors/{id}
    [HttpPut("doctors/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateDoctor(int id, [FromForm] UpdateDoctorDto updateDto, IFormFile? profileImage)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null) return NotFound();

        doctor.name = updateDto.name;
        doctor.city = updateDto.city;
        doctor.specializationId = updateDto.specializationId;

        if (profileImage != null)
        {
            if (!string.IsNullOrEmpty(doctor.profileImagePath))
            {
                _fileService.DeleteImage(doctor.profileImagePath);
            }
            doctor.profileImagePath = await _fileService.SaveImageAsync(profileImage, "doctors");
        }

        _context.Entry(doctor).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok("Doctor updated successfully.");
    }

    // DELETE: api/Admin/doctors/{id}
    [HttpDelete("doctors/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null) return NotFound();

        if (!string.IsNullOrEmpty(doctor.profileImagePath))
        {
            _fileService.DeleteImage(doctor.profileImagePath);
        }

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();

        return Ok("Doctor deleted successfully.");
    }


    // ========================================= APPOINTMENTS =========================================

    // GET: api/Admin/appointments
    [HttpGet("appointments")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAllAppointments()
    {
        return await _context.Appointments
            .Include(a => a.user)
            .Include(a => a.doctor)
            .Select(a => new AppointmentDto
            {
                id = a.appointmentId,
                userId = a.userId,
                userName = (a.user != null) ? a.user.username ?? "N/A" : "N/A",
                doctorId = a.doctorId,
                doctorName = (a.doctor != null) ? a.doctor.name ?? "N/A" : "N/A",
                appointmentDate = a.appointmentDate,
                timeSlot = a.timeSlot ?? string.Empty,
                status = a.status ?? string.Empty
            })
            .ToListAsync();
    }


    // ================= ADMIN SIDE =================
// ================= ADMIN SIDE =================

// Admin can cancel any user's appointment
[Authorize(Roles = "Admin")]
[HttpPut("{id}/admin-cancel")]
public async Task<IActionResult> CancelAppointmentByAdmin(int id)
{
    var appointment = await _context.Appointments.FindAsync(id);
    if (appointment == null) return NotFound("Appointment not found.");

    appointment.status = "Cancelled";
    _context.Entry(appointment).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return Ok("Appointment cancelled successfully by Admin.");
}

// Admin can update/edit any appointment
[Authorize(Roles = "Admin")]
[HttpPut("{id}/admin-update")]
public async Task<IActionResult> UpdateAppointmentByAdmin(int id, [FromBody] AppointmentDto updateDto)
{
    var appointment = await _context.Appointments.FindAsync(id);
    if (appointment == null) return NotFound("Appointment not found.");

    // Update appointment fields using AppointmentDto
    appointment.doctorId = updateDto.doctorId != 0 ? updateDto.doctorId : appointment.doctorId;
    appointment.appointmentDate = updateDto.appointmentDate != default ? updateDto.appointmentDate : appointment.appointmentDate;
    appointment.timeSlot = !string.IsNullOrEmpty(updateDto.timeSlot) ? updateDto.timeSlot : appointment.timeSlot;
    appointment.status = !string.IsNullOrEmpty(updateDto.status) ? updateDto.status : appointment.status;

    _context.Entry(appointment).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return Ok("Appointment updated successfully by Admin.");
}

}
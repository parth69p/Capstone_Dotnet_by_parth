// here we are going to implement appointment Controller
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Fracto.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All actions in this controller require a logged-in user
    public class AppointmentController : ControllerBase
    {
        private readonly FractoDbContext _context;

        public AppointmentController(FractoDbContext context)
        {
            _context = context;
        }

        //========================================= USER SIDE =====================================

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> BookAppointment([FromBody] CreateAppointmentDto createDto)
        {
            // Get the current user's ID from the JWT token claims
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var appointment = new Appointment
            {
                userId = userId,
                doctorId = createDto.doctorId,
                appointmentDate = createDto.appointmentDate.Date, // Store only the date part
                timeSlot = createDto.timeSlot,
                status = "Booked" // Default status
            };

            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();

            // Load related data to return in the DTO
            await _context.Entry(appointment).Reference(a => a.user).LoadAsync();
            await _context.Entry(appointment).Reference(a => a.doctor).LoadAsync();

            var appointmentDto = new AppointmentDto
            {
                id = appointment.appointmentId,
                userId = appointment.userId,
                userName = appointment.user?.username ?? "N/A",
                doctorId = appointment.doctorId,
                doctorName = appointment.doctor?.name ?? "N/A",
                appointmentDate = appointment.appointmentDate,
                timeSlot = appointment.timeSlot,
                status = appointment.status
            };

            return CreatedAtAction(nameof(GetMyAppointments), new { id = appointment.appointmentId }, appointmentDto);
        }

        // GET: api/Appointments/my-appointments
        [HttpGet("my-appointments")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var appointments = await _context.Appointments
                .Include(a => a.user)
                .Include(a => a.doctor)
                .Where(a => a.userId == userId)
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

            return Ok(appointments);
        }

        // PUT: api/Appointments/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            // Security check: Ensure the user is cancelling their own appointment
            if (appointment.userId != userId)
            {
                return Forbid("You are not authorized to cancel this appointment.");
            }

            appointment.status = "Cancelled";
            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok("Appointment cancelled successfully.");
        }

        // ================= ADMIN SIDE =================

        // GET: api/Appointments
        [HttpGet]
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
    }
}

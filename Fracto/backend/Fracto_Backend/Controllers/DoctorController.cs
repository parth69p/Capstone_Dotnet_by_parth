using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fracto.Backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly FractoDbContext _context;
        private readonly IFileService _fileService;

        public DoctorController(FractoDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        //================== USER SIDE ===================
        // GET: api/Doctors/search?city=NewYork&specializationId=1&minRating=4
        [HttpGet("search")]
        [Authorize] // Any logged-in user can search
        public async Task<ActionResult<IEnumerable<DoctorDto>>> SearchDoctors([FromQuery] string city, [FromQuery] int specializationId, [FromQuery] double minRating = 0)
        {
            if (string.IsNullOrWhiteSpace(city) || specializationId <= 0)
            {
                return BadRequest("City and specialization are required.");
            }

            var query = _context.Doctors
                .Include(d => d.Specialization)
                .Where(d => (d.city ?? string.Empty).ToLower() == city.ToLower() && d.specializationId == specializationId);

            if (minRating > 0)
            {
                query = query.Where(d => d.rating >= minRating);
            }

            var doctors = await query.Select(d => new DoctorDto
            {
                id = d.doctorId,
                name = d.name ?? string.Empty,
                city = d.city ?? string.Empty,
                rating = d.rating,
                profileImagePath = d.profileImagePath ?? string.Empty,
                specializationId = d.specializationId,
                specializationName = d.Specialization.specializationName ?? string.Empty
            })
                .ToListAsync();

            if (!doctors.Any())
            {
                return NotFound("No doctors found matching your criteria.");
            }

            return Ok(doctors);
        }


        // for fetching the cities from the doctor records. for 
        [HttpGet("cities")]
        [Authorize] // allow users
        public async Task<ActionResult<IEnumerable<string>>> GetCities()
        {
            var cities = await _context.Doctors.Select(d => d.city).Distinct().ToListAsync();
            return Ok(cities);
        }

        //=================================== ADMIN SIDE ================================

        // GET: api/Doctors
        [HttpGet]
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

        // POST: api/Doctors
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DoctorDto>> CreateDoctor([FromForm] CreateDoctorDto createDto, IFormFile? profileImage)
        {
            var doctor = new Doctor
            {
                name = createDto.name,
                city = createDto.city,
                specializationId = createDto.specializationId,
                rating = 0 // New doctors start with a 0 rating
            };

            if (profileImage != null)
            {
                doctor.profileImagePath = await _fileService.SaveImageAsync(profileImage, "doctors");
            }

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();

            // Reload the Specialization navigation property to return it in the DTO
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

        // PUT: api/Doctors/5
        [HttpPut("{id}")]
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

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
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
    }
}
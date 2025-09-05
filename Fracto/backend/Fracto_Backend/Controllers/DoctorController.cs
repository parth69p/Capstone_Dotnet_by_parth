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


        [HttpGet("specializations")]
        public async Task<ActionResult<IEnumerable<object>>> GetSpecializations()
        {
            var specs = await _context.Specializations
                .Select(s => new
                {
                    specializationId = s.specializationId,
                    specializationName = s.specializationName
                })
                .ToListAsync();

            return Ok(specs);

        }

        // for Displaying Records of doctors to the user 
        [HttpGet("all")]
        [Authorize] // allow any logged-in user
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetAllDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Specialization)
                .Select(d => new DoctorDto
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

            return Ok(doctors);
        }



        //=================================== ADMIN SIDE ================================

    }
}
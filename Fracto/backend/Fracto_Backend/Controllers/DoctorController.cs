// 


using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;


    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly FractoDbContext _db;
        public DoctorsController(FractoDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? city, [FromQuery] int? specializationId, [FromQuery] double? minRating)
        {
            var q = _db.Doctors.Include(d=>d.specializationId).AsQueryable();
            if (!string.IsNullOrEmpty(city)) q = q.Where(d => d.city == city);
            if (specializationId.HasValue) q = q.Where(d => d.specializationId == specializationId.Value);
            if (minRating.HasValue) q = q.Where(d => d.rating >= minRating.Value);
            var list = await q.ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Doctor doc)
        {
            _db.Doctors.Add(doc);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = doc.doctorId }, doc);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var doc = await _db.Doctors.Include(d=>d.specializationId).FirstOrDefaultAsync(d=>d.doctorId==id);
            if (doc == null) return NotFound();
            return Ok(doc);
        }
    
}
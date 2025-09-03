    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string?> SaveImageAsync(IFormFile imageFile, string subfolder)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return null;
            }

            // Get the absolute path to the 'wwwroot/uploads/{subfolder}' directory
            var uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", subfolder);

            // Create the directory if it doesn't exist
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            // Generate a unique file name to prevent conflicts
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
            var filePath = Path.Combine(uploadDir, fileName);

        // Save the file to the server
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(stream);
        }

            // Return the relative path to be stored in the database
            return Path.Combine("uploads", subfolder, fileName).Replace("\\", "/");
        }

        public void DeleteImage(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath)) return;

            // Get the absolute path to the file
            var fullPath = Path.Combine(_webHostEnvironment.WebRootPath, imagePath);

            // Check if the file exists and delete it
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
     }
}

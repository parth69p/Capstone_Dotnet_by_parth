//This file defines the IFileService interface for file operations.


    public interface IFileService
    {
        Task<string?> SaveImageAsync(IFormFile imageFile, string subfolder);
        void DeleteImage(string imagePath);
    }

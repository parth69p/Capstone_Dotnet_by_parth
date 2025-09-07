-- Table: Specializations

CREATE TABLE Specializations (
    specializationId INT IDENTITY(1,1) PRIMARY KEY,
    specializationName NVARCHAR(100) NOT NULL
);

-- Table: Users
CREATE TABLE Users (
    userId INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(MAX) NOT NULL,
    role NVARCHAR(20) NOT NULL,
    profileImagePath NVARCHAR(255) NULL
);

-- Table: Doctors
CREATE TABLE Doctors (
    doctorId INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    specializationId INT NOT NULL,
    city NVARCHAR(100) NOT NULL,
    rating FLOAT DEFAULT 0,
    profileImagePath NVARCHAR(255) NULL,
    CONSTRAINT FK_Doctor_Specialization FOREIGN KEY (specializationId)
        REFERENCES Specializations(specializationId)
        ON DELETE CASCADE
);

-- Table: Appointments
CREATE TABLE Appointments (
    appointmentId INT IDENTITY(1,1) PRIMARY KEY,
    appointmentDate DATETIME NOT NULL,
    timeSlot NVARCHAR(50) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'Booked',
    userId INT NOT NULL,
    doctorId INT NOT NULL,
    CONSTRAINT FK_Appointment_User FOREIGN KEY (userId)
        REFERENCES Users(userId)
        ON DELETE CASCADE,
    CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (doctorId)
        REFERENCES Doctors(doctorId)
        ON DELETE CASCADE
);

--Table: Ratings 
CREATE TABLE Ratings (
    ratingId INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    doctorId INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment NVARCHAR(255) NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Rating_User FOREIGN KEY (userId)
        REFERENCES Users(userId)
        ON DELETE CASCADE,
    CONSTRAINT FK_Rating_Doctor FOREIGN KEY (doctorId)
        REFERENCES Doctors(doctorId)
        ON DELETE CASCADE
);

-- Create the Courses table
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-incrementing primary key
    course_name VARCHAR(255) NOT NULL, -- Name of the course
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of creation
);

-- Create the Subjects table
CREATE TABLE Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-incrementing primary key
    course_id INT NOT NULL, -- Foreign key to Courses table
    subject_name VARCHAR(255) NOT NULL, -- Name of the subject
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- Create the Questions table
CREATE TABLE Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-incrementing primary key
    subject_id INT NOT NULL, -- Foreign key to Subjects table
    question_text TEXT NOT NULL, -- Text of the question
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
);

-- Create the Options table
CREATE TABLE Options (
    option_id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-incrementing primary key
    question_id INT NOT NULL, -- Foreign key to Questions table
    option_text TEXT NOT NULL, -- Text of the option
    is_correct BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the option is correct
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of creation
    FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
);

-- Create the users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
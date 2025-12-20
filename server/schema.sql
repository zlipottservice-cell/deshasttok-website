-- 1. Categories Table (Metadata for Dropdowns)
-- Stores the Configuration (JSON) for each Exam/Class in a SINGLE ROW
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- 'exam' or 'class'
  value VARCHAR(50) NOT NULL, -- 'JEE', 'NEET', '10', '12'
  config TEXT NOT NULL -- JSON Object: { "Subject": "Chapter1,Chapter2", ... }
);

-- 2. Admin Users Table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_text TEXT,
  question_image_url VARCHAR(255),
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
  
  -- Metadata columns
  exam VARCHAR(50), 
  board VARCHAR(50), 
  class INT, 
  subject VARCHAR(50),
  chapter VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA: CATEGORIES (Configuration using JSON)
-- ONE ROW per Exam/Class containing ALL subjects and chapters
INSERT INTO categories (type, value, config) VALUES 
('exam', 'JEE', '{"Physics": "Kinematics,Thermodynamics,Gravitation", "Maths": "Calculus,Vectors,Algebra", "Chemistry": "Atomic Structure,Bonding"}'),
('exam', 'NEET', '{"Biology": "Cell Biology,Genetics,Human Physiology", "Physics": "Mechanics,Optics", "Chemistry": "Organic,Inorganic"}'),
('class', '10', '{"Science": "Chemical Reactions,Acids Bases,Light,Human Eye", "Maths": "Real Numbers,Polynomials,Triangles"}'),
('class', '12', '{"Maths": "Relations Functions,Matrices,Integrals", "Physics": "Electrostatics,Magnetism", "Chemistry": "Solid State,Solutions"}');


-- DUMMY DATA: QUESTIONS (Content)
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, exam, class, subject, chapter) VALUES 
-- JEE Physics
('A projectile is fired at 45 degrees. The range is:', 'Maximum', 'Minimum', 'Zero', 'Infinite', 'A', 'Range is max at 45 degrees.', 'Easy', 'JEE', 11, 'Physics', 'Kinematics'),
('Velocity at top of trajectory for projectile is:', 'u cos theta', 'u sin theta', '0', 'u', 'A', 'Vertical component is zero.', 'Medium', 'JEE', 11, 'Physics', 'Kinematics'),

-- JEE Maths
('If f(x) = sin x, then f''(x) is:', 'cos x', '-sin x', 'sin x', '-cos x', 'B', 'Derivative of sin is cos, derivative of cos is -sin.', 'Easy', 'JEE', 12, 'Maths', 'Calculus'),
('Integration of 1/x dx is:', 'log x', 'e^x', 'x^2/2', '-1/x^2', 'A', 'Standard integral.', 'Easy', 'JEE', 12, 'Maths', 'Calculus'),

-- NEET Biology
('Which is known as the suicide bag of the cell?', 'Lysosome', 'Ribosome', 'Mitochondria', 'Nucleus', 'A', 'Lysosomes contain lytic enzymes.', 'Easy', 'NEET', 11, 'Biology', 'Cell Biology'),

-- Class 10 Science
('Chemical formula of rust is:', 'Fe2O3.xH2O', 'Fe2O3', 'Fe3O4', 'FeCO3', 'A', 'Hydrated Iron(III) Oxide.', 'Medium', NULL, 10, 'Science', 'Chemical Reactions');




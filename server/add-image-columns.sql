-- Add image columns to questions table
ALTER TABLE questions 
ADD COLUMN question_image VARCHAR(500) AFTER question_text,
ADD COLUMN option_a_image VARCHAR(500) AFTER option_a,
ADD COLUMN option_b_image VARCHAR(500) AFTER option_b,
ADD COLUMN option_c_image VARCHAR(500) AFTER option_c,
ADD COLUMN option_d_image VARCHAR(500) AFTER option_d,
ADD COLUMN explanation_image VARCHAR(500) AFTER explanation;

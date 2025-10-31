/*
  # Helix Platform Database Schema

  ## Overview
  Creates the database schema for Helix HR Assistant and Career Progress Platform.
  This migration sets up tables for user management, chat interactions, employee profiles, 
  and career recommendations with comprehensive Row Level Security.

  ## Tables Created
  
  ### 1. profiles
  Extends Supabase auth.users with additional user information
  - `id` (uuid, FK to auth.users) - Primary key linked to authentication
  - `email` (text) - User email address
  - `role` (text) - User role: 'hr' or 'employee'
  - `name` (text) - Full name of the user
  - `department` (text) - User's department
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. chat_messages
  Stores all HR assistant chat interactions
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Reference to profiles table
  - `message` (text) - Employee's question
  - `response` (text) - AI-generated answer
  - `rating` (text) - Feedback: 'up', 'down', or null
  - `response_time` (numeric) - Time taken to generate response in seconds
  - `created_at` (timestamptz) - Message timestamp

  ### 3. employee_profiles
  Stores parsed career data from employee resumes
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Reference to profiles table
  - `skills` (jsonb) - Array of skills with proficiency levels
  - `projects` (jsonb) - Array of project descriptions
  - `certifications` (jsonb) - Array of certifications
  - `resume_url` (text) - URL to uploaded resume file
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. career_recommendations
  Stores AI-generated career guidance
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Reference to profiles table
  - `next_role` (text) - Recommended next career step
  - `skill_gaps` (jsonb) - Array of skills to develop
  - `suggested_projects` (jsonb) - Array of project recommendations
  - `suggested_training` (jsonb) - Array of training/certification recommendations
  - `created_at` (timestamptz) - Recommendation generation timestamp

  ### 5. hr_policies
  Stores HR policy documents for RAG system
  - `id` (uuid) - Primary key
  - `title` (text) - Policy document title
  - `content` (text) - Full policy text
  - `category` (text) - Policy category (e.g., 'PTO', 'Benefits')
  - `embedding` (vector) - Vector embedding for semantic search
  - `created_at` (timestamptz) - Document upload timestamp
  - `updated_at` (timestamptz) - Last document update timestamp

  ## Security (Row Level Security)
  
  All tables have RLS enabled with the following policies:
  
  ### profiles
  - Users can view their own profile
  - HR users can view all profiles
  - Users can update their own profile
  
  ### chat_messages
  - Users can view their own chat history
  - HR users can view all chat messages (for analytics)
  - Users can insert their own messages
  - Users can update ratings on their own messages
  
  ### employee_profiles
  - Users can view and update their own profile
  - HR users can view all employee profiles
  
  ### career_recommendations
  - Users can view their own recommendations
  - HR users can view all recommendations
  
  ### hr_policies
  - All authenticated users can read policies
  - Only HR users can insert/update/delete policies

  ## Notes
  - All timestamps use timestamptz for timezone awareness
  - Foreign keys ensure referential integrity
  - Indexes are created for commonly queried fields
  - Vector extension is enabled for semantic search capabilities
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('hr', 'employee')),
  name text NOT NULL,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "HR can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  rating text CHECK (rating IN ('up', 'down')),
  response_time numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "HR can view all messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own message ratings"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create employee_profiles table
CREATE TABLE IF NOT EXISTS employee_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skills jsonb DEFAULT '[]'::jsonb,
  projects jsonb DEFAULT '[]'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  resume_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employee profile"
  ON employee_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "HR can view all employee profiles"
  ON employee_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

CREATE POLICY "Users can insert own employee profile"
  ON employee_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employee profile"
  ON employee_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create career_recommendations table
CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  next_role text NOT NULL,
  skill_gaps jsonb DEFAULT '[]'::jsonb,
  suggested_projects jsonb DEFAULT '[]'::jsonb,
  suggested_training jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON career_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "HR can view all recommendations"
  ON career_recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

CREATE POLICY "System can insert recommendations"
  ON career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create hr_policies table
CREATE TABLE IF NOT EXISTS hr_policies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hr_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read policies"
  ON hr_policies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "HR can insert policies"
  ON hr_policies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

CREATE POLICY "HR can update policies"
  ON hr_policies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

CREATE POLICY "HR can delete policies"
  ON hr_policies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_user_id ON employee_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_hr_policies_category ON hr_policies(category);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_profiles_updated_at
  BEFORE UPDATE ON employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_policies_updated_at
  BEFORE UPDATE ON hr_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

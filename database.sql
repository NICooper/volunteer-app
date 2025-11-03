CREATE TABLE IF NOT EXISTS accounts (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  pw_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY REFERENCES accounts,
  username VARCHAR(255) NOT NULL UNIQUE,
  profile_photo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS organisations (
  id INT PRIMARY KEY REFERENCES accounts,
  name VARCHAR(255) NOT NULL UNIQUE,
  profile_photo_url VARCHAR(255),
  address VARCHAR(255),
  website VARCHAR(255),
  org_level_approval BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS activities (
  activity_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(2000),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_tags (
  activity_id INT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(activity_id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, tag)
);

CREATE TABLE IF NOT EXISTS shifts (
  shift_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  activity_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(2000),
  num_openings INT NOT NULL,
  require_approval BOOLEAN DEFAULT FALSE,
  questionnaire_json JSONB,
  FOREIGN KEY (activity_id) REFERENCES activities(activity_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  event_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  shift_id INT NOT NULL,
  description VARCHAR(2000),
  location VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  FOREIGN KEY (shift_id) REFERENCES shifts(shift_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shift_volunteers (
  user_id INT NOT NULL,
  shift_id INT NOT NULL,
  is_approved BOOLEAN,
  form_json JSONB,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shift_id) REFERENCES shifts(shift_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, shift_id)
);

CREATE TABLE IF NOT EXISTS worked_events (
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  checked_in_at TIMESTAMP,
  checked_out_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  UNIQUE (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS user_connections (
  user_id INT NOT NULL,
  connected_to_user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (connected_to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, connected_to_user_id)
);

CREATE TABLE IF NOT EXISTS follows (
  user_id INT NOT NULL,
  org_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS org_volunteers (
  user_id INT NOT NULL,
  org_id INT NOT NULL,
  is_approved BOOLEAN,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  user_id INT NOT NULL,
  org_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS categories (
  name VARCHAR(100) NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS shift_categories (
  shift_id INT NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (shift_id) REFERENCES shifts(shift_id) ON DELETE CASCADE,
  FOREIGN KEY (category_name) REFERENCES categories(name) ON DELETE CASCADE,
  PRIMARY KEY (shift_id, category_name)
);

CREATE TABLE IF NOT EXISTS qr_codes (
  code VARCHAR(20) NOT NULL PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL
);

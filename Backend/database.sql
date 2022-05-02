-- Création de la table users
	
	
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
	
	SELECT uuid_generate_v4();
	
	CREATE TABLE users (
		user_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
		email VARCHAR(70) UNIQUE,
		password VARCHAR(200) NOT NULL,
		name VARCHAR(50) NOT NULL,
		firstname VARCHAR(50) NOT NULL,
		civilite char(1) NOT NULL,
		admin BOOLEAN DEFAULT FALSE
	);
	
	-- Création de la table posts
	
	CREATE TABLE posts (
	post_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	owner_id uuid REFERENCES users (user_id),
	content TEXT,
	date DATE
	);
	
	SET DateStyle=dmy, iso;

   -- Création de la table likes
	
	CREATE TABLE likes (
		like_id SERIAL PRIMARY KEY,
		owner_id uuid REFERENCES users (user_id),
		post_id uuid REFERENCES posts (post_id),
		like_value BOOLEAN NOT NULL
	);
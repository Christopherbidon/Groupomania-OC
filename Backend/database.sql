CREATE DATABASE groupomania
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


-- Création de la table users
	
	
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
	
	SELECT uuid_generate_v4();
	
	CREATE TABLE users (
		user_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
		email VARCHAR(70) UNIQUE,
		password VARCHAR(200) NOT NULL,
		name VARCHAR(50) NOT NULL,
		firstname VARCHAR(50) NOT NULL,
		avatar_url VARCHAR(255) DEFAULT 'http://localhost:4000/config/defaultMedia/defaultAvatar',
		admin BOOLEAN DEFAULT FALSE
	);

	-- Création du compte admin


	INSERT INTO users (email, password, name, firstname,  admin)
	VALUES('admin@gmail.com', '$2b$10$AtRTvx7VoEOjjEn/4c7kVusJD8BA.NXWeV5NiKCQ5hvr8y7Ah8OIC', 'admin', 'admin', true)
	
	
	-- Création de la table posts
	
	CREATE TABLE posts (
	post_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	owner_id uuid REFERENCES users (user_id),
   likes INT DEFAULT 0,
   dislikes INT DEFAULT 0,
	content TEXT,
	date bigint,
   image_url VARCHAR(255)
	);
	
	SET DateStyle=dmy, iso;

   -- Création de la table likes
	
	CREATE TABLE likes (
		like_id SERIAL PRIMARY KEY,
		owner_id uuid REFERENCES users (user_id),
		post_id uuid REFERENCES posts (post_id),
		like_value BOOLEAN NOT NULL
	);

	-- Création de la table comments

	CREATE TABLE comments (
		comment_id SERIAL PRIMARY KEY,
		owner_id uuid REFERENCES users (user_id),
		post_id uuid REFERENCES posts (post_id),
		content TEXT,
		date bigint
	);
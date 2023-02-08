-- DROP TABLE user_info;
CREATE TABLE user_info (
	id VARCHAR(20) PRIMARY KEY, 
	hash VARBINARY(20), 
	salt VARBINARY(20)	
);

-- DROP TABLE books;
CREATE TABLE books (
	book_key VARCHAR (20) PRIMARY KEY,
	book_title VARCHAR (40),
	book_author VARCHAR (40),
	book_cover VARCHAR (100));

-- DROP TABLE book_posts;
CREATE TABLE book_posts (
	user_id VARCHAR(20),
	book_key VARCHAR(20),
	post VARCHAR(1000),
	tag VARCHAR(20)
);

-- DROP TABLE friends;
CREATE TABLE friends (
	user_id_1 VARCHAR(20),
	user_id_2 VARCHAR(20)
); 
	
-- DROP TABLE user_clubs;
CREATE TABLE user_clubs (
	user_id VARCHAR(20),
	book_key VARCHAR (20)
); 

-- DROP TABLE saved_books;
CREATE TABLE saved_books (
	user_id VARCHAR(20),
	book_key VARCHAR (20)
);

-- DROP TABLE sent_recommendations;
CREATE TABLE sent_recommendations (
	sender_username VARCHAR(20),
	recipient_username VARCHAR(20),
	book_key VARCHAR (20)
);



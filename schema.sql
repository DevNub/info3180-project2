drop database if exists photogram;
create database photogram; 
use photogram;

create table users(
	user_id int,
	username varchar(80),
	password varchar(255),
	firstname varchar(80),
	lastname varchar(80),
	email varchar(80),
	location varchar(80),
	biography varchar(300),
	profile_photo varchar(80),
	joined_on date,
	primary key (user_id)
);
 
create table posts(
	post_id int,
	user_id int,
	photo varchar(80),
	caption varchar(120),
	created_on date,
	primary key (posts_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade

);

create table likes( 
	likes_id int,
	user_id int,
	post_id int,	
	primary key (likes_id, user_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade,
	foreign key (post_id) references posts(post_id) on delete cascade on update cascade
);

create table follows(
	follows_id int,
	user_id int,
	follower_id int,
	primary key (follows_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade
);

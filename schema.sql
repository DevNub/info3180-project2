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

/* Dummy data /
insert into table users (user_id, username, password, firstname, lastname, email, location, biography, profile_photo, joined_on)
values ('20190029', 'test1', 'password', 'ari', 'jones', 'drejay@email.com', 'Kingston', 'my bio here', './app/static/images/profiles/Ari', '2019-04-04');

insert into table users (user_id, username, password, firstname, lastname, email, location, biography, profile_photo, joined_on)
values ('20190283', 'test2', 'password', 'john', 'doe', 'johndoe@email.com', 'Kingston', '', '', '2019-04-20');


insert into table posts (post_id, user_id, photo, caption, created_on)
values ('profile', '20190029', './app/static/images/uploads/profile', 'My Photo', '2019-04-24');


insert into table follows (follows_id, user_id, follower_id)
values ('0237', '20190029', '20190283');

/* */
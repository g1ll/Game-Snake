CREATE DATABASE snake;

CREATE TABLE ranking(
    id serial not null primary key,
    name varchar(100),
    score integer
);

INSERT INTO ranking(name,score) VALUES('gill',100);
INSERT INTO ranking(name,score) VALUES('gill',50);
INSERT INTO ranking(name,score) VALUES('gill',25);

SELECT * FROM ranking ORDER BY SCORE DESC;
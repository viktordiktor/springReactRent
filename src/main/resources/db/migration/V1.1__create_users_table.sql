CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255),
                       password VARCHAR(255),
                       role VARCHAR(255)
);
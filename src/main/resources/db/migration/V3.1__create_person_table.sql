CREATE TABLE person (
                        id SERIAL PRIMARY KEY,
                        full_name VARCHAR(255) NOT NULL,
                        phone VARCHAR(255) NOT NULL,
                        user_id INT,
                        FOREIGN KEY (user_id) REFERENCES users(id)
);
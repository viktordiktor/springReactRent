CREATE TABLE properties (
                            id SERIAL PRIMARY KEY,
                            user_id INT,
                            address VARCHAR(255) NOT NULL,
                            price DECIMAL(10,2) NOT NULL,
                            description VARCHAR(255),
                            rooms INT,
                            square FLOAT,
                            type VARCHAR(255),
                            deleted BOOLEAN,
                            FOREIGN KEY (user_id) REFERENCES users(id)
);
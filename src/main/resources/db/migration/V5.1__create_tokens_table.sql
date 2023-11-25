CREATE TABLE token (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        token VARCHAR(255) UNIQUE,
                        token_type VARCHAR(255),
                        revoked BOOLEAN,
                        expired BOOLEAN
);
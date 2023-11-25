CREATE TABLE images (
                        id SERIAL PRIMARY KEY,
                        property_id INT,
                        image_data BYTEA,
                        FOREIGN KEY (property_id) REFERENCES properties(id)
);
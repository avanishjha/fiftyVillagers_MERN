CREATE TABLE IF NOT EXISTS exam_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    exam_date TIMESTAMP NOT NULL
);

INSERT INTO exam_centers (name, location, capacity, exam_date)
VALUES ('Fify Villagers Main Center', '123 Education Lane, Village City', 1000, '2025-05-15 10:00:00')
ON CONFLICT DO NOTHING;

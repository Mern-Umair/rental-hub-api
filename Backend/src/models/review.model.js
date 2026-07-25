export const createReviewTable = async (db) => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            property_id INT NOT NULL,
            FOREIGN KEY (property_id) REFERENCES properties(id),
            reviewer_id INT NOT NULL,
            FOREIGN KEY (reviewer_id) REFERENCES users(id),
            rating INT NOT NULL,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
}
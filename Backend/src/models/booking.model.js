export const createBookingTable = async (db) => {
    await db.execute(
        `
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            property_id INT NOT NULL,
            FOREIGN KEY (property_id) REFERENCES properties(id),
            tenant_id INT NOT NULL,
            FOREIGN KEY (tenant_id) REFERENCES users(id),
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
            total_price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
    )
}
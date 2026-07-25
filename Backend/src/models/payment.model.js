export const createPaymentTable = async (db) => {
    await db.execute(
        `
        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            booking_id INT NOT NULL,
            FOREIGN KEY (booking_id) REFERENCES bookings(id),
            tenant_id INT NOT NULL,
            FOREIGN KEY (tenant_id) REFERENCES users(id),
            amount DECIMAL(10,2) NOT NULL,
            payment_method ENUM('cash','card','bank_transfer') DEFAULT 'cash',
            status ENUM('pending','completed','failed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
    )
}
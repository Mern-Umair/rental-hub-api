import { db } from "../config/db.js";


export const createBooking = async (req, res) => {
    try {
        const { id } = req.user;

        const { property_id, start_date, end_date, total_price } = req.body;


        // validation
        if (!property_id || !start_date || !end_date || !total_price) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const [insert] = await db.execute(
            `INSERT INTO bookings (property_id, tenant_id, start_date, end_date, total_price) VALUES (?,?,?,?,?)`,
            [property_id, id, start_date, end_date, total_price]
        )

        const [booking] = await db.execute(
            `SELECT * FROM bookings WHERE id=?`,
            [insert.insertId]
        )

        res.status(201).json({
            message: "Booking created successfully",
            success: true,
            booking: booking[0]
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}



export const getBookings = async (req, res) => {
    try {
        const { id, role } = req.user;

        let bookings;

        if (role === 'admin') {
            [bookings] = await db.execute(`SELECT * FROM bookings`)

        } else if (role === 'tenant') {
            [bookings] = await db.execute(
                `SELECT * FROM bookings WHERE tenant_id=?`, [id]
            )

        } else if (role === 'owner') {
            [bookings] = await db.execute(
                `SELECT * FROM bookings 
                 INNER JOIN properties ON bookings.property_id = properties.id 
                 WHERE properties.owner_id=?`, [id]
            )

        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        if (bookings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No bookings found",
                bookings: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            bookings
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const [bookings] = await db.execute(
            `SELECT * FROM bookings WHERE id=?`,
            [id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
                bookings: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            bookings: bookings[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "confirmed",
            "completed",
            "cancelled"
        ];

        // validation
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        // validate status
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        const [result] = await db.execute(
            `UPDATE bookings
             SET status=?
             WHERE id=?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const [bookings] = await db.execute(
            `SELECT * FROM bookings WHERE id=?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking: bookings[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const deleteBooking = async (req, res) => {
    try {

        const { id } = req.params;
        const userId = req.user.id;

        // booking find
        const [existingBooking] = await db.execute(
            `SELECT * FROM bookings WHERE id=?`,
            [id]
        );

        // booking not found
        if (existingBooking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // only tenant can cancel own booking
        if (existingBooking[0].tenant_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - You can cancel only your own booking"
            });
        }

        // update booking status
        await db.execute(
            `UPDATE bookings 
             SET status=? 
             WHERE id=?`,
            ["cancelled", id]
        );

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            status: "cancelled"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};
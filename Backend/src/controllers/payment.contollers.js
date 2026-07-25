import { db } from "../config/db.js";


export const createPayment = async (req, res) => {
    try {
        const { id } = req.user;

        const { booking_id, amount, payment_method } = req.body;

        // validation
        if (!booking_id || !amount) {
            return res.status(400).json({
                success: false,
                message: "booking_id and amount are required"
            });
        }

        // check booking exists
        const [booking] = await db.execute(
            `SELECT * FROM bookings WHERE id=?`,
            [booking_id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // check tenant is owner of booking
        if (booking[0].tenant_id !== id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - This is not your booking"
            });
        }

        // create payment
        const [result] = await db.execute(
            `INSERT INTO payments (booking_id, tenant_id, amount, payment_method) VALUES (?,?,?,?)`,
            [booking_id, id, amount, payment_method || "cash"]
        );

        // fetch created payment
        const [payment] = await db.execute(
            `SELECT * FROM payments WHERE id=?`,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment: payment[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}



export const getAllPayments = async (req, res) => {
    try {
        const { id, role } = req.user;

        let payments;

        if (role === 'admin') {
            [payments] = await db.execute(`SELECT * FROM payments`)

        } else if (role === 'tenant') {
            [payments] = await db.execute(
                `SELECT * FROM payments WHERE tenant_id=?`, [id]
            )

        } else if (role === 'owner') {
            [payments] = await db.execute(
                `SELECT * FROM payments 
                 INNER JOIN bookings ON payments.booking_id = bookings.id
                 INNER JOIN properties ON bookings.property_id = properties.id
                 WHERE properties.owner_id=?`, [id]
            )

        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        if (payments.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No payments found",
                payments: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            payments
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [payment] = await db.execute(
            `SELECT * FROM payments WHERE id=?`, [id]
        );

        if (payment.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        if (userRole !== 'admin' && payment[0].tenant_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            payment: payment[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = ['pending', 'completed', 'failed'];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const [result] = await db.execute(
            `UPDATE payments SET status=? WHERE id=?`, [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const [payment] = await db.execute(
            `SELECT * FROM payments WHERE id=?`, [id]
        );

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            payment: payment[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
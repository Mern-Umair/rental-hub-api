import { db } from "../config/db.js";

export const createReview = async (req, res) => {
    try {
        const { id } = req.user;
        const { property_id, rating, comment } = req.body;

        if (!property_id || !rating) {
            return res.status(400).json({
                success: false,
                message: "property_id and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const [property] = await db.execute(
            `SELECT * FROM properties WHERE id=?`, [property_id]
        );

        if (property.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO reviews (property_id, reviewer_id, rating, comment) VALUES (?,?,?,?)`,
            [property_id, id, rating, comment || null]
        );

        const [review] = await db.execute(
            `SELECT * FROM reviews WHERE id=?`, [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: review[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getReviews = async (req, res) => {
    try {
        const { property_id } = req.params;

        const [reviews] = await db.execute(
            `SELECT * FROM reviews WHERE property_id=?`, [property_id]
        );

        if (reviews.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No reviews found",
                reviews: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [review] = await db.execute(
            `SELECT * FROM reviews WHERE id=?`, [id]
        );

        if (review.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (userRole !== 'admin' && review[0].reviewer_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - You can only delete your own review"
            });
        }

        await db.execute(`DELETE FROM reviews WHERE id=?`, [id]);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
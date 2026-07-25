import { db } from "../config/db.js";


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }

        // 2. Check if user already exists
        const [existingUser] = await db.execute(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                status: 409,
                message: "Email already exists"
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert user
        const [result] = await db.execute(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role || "user"]
        );

        // 5. Get created user (IMPORTANT 🔥)
        const [newUser] = await db.execute(
            `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
            [result.insertId]
        );

        // 6. Send clean response
        res.status(201).json({
            status: 201,
            message: "User created successfully",
            user: newUser[0]
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email) {
            return res.status(400).json({
                status: 400,
                message: "Email  are required"
            });
        }
        if (!password) {
            return res.status(400).json({
                status: 400,
                message: "password  are required"
            });
        }
        // 2. Check user exists
        const [users] = await db.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        const user = users[0];

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: "Invalid credentials"
            });
        }

        // 4. Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Response
        res.status(200).json({
            status: 200,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};


export const getProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const [users] = await db.execute(
            `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        res.status(200).json({
            status: 200,
            message: "User found",
            user: users[0]
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const fields = [];
        const values = [];

        if (req.body.name) {
            fields.push('name=?');
            values.push(req.body.name);
        }
        if (req.body.email) {
            fields.push('email=?');
            values.push(req.body.email);
        }
        if (req.body.phone) {
            fields.push('phone=?');
            values.push(req.body.phone);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields to update" })
        }

        values.push(id);

        await db.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id=?`,
            values
        )

        const [users] = await db.execute(
            `SELECT * FROM users WHERE id=?`, [id]
        )

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: users[0]
        })

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { oldPassword, newPassword } = req.body
        // 1. Validation
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old and new password are required"
            });
        }
        const [users] = await db.execute(`SELECT * FROM users WHERE id=?`, [id])
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, users[0].password)

        if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" })
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        // 6. Update password
        await db.execute(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hashedPassword, id]
        );
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }
    catch (err) {
        console.log("Error", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT id, name, email, phone,role FROM users`
        );
        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found",
                users: []
            });
        }
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });

    } catch (err) {
        console.error("Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}
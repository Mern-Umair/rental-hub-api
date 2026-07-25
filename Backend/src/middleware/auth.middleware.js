import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
    try {
        // 1. Token lo header se
        const token = req.headers.authorization?.split(' ')[1]

        // 2. Token hai ya nahi check karo
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        // 3. Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 4. req.user mein rakho
        req.user = decoded

        // 5. Aage jao
        next()
        console.log("HEADERS:", req.headers);

    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}
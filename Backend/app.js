import express from 'express'
import cors from 'cors'
import userTable from "./src/routes/user.route.js"
import propertyTable from "./src/routes/property.route.js"
import bookingsTable from "./src/routes/bookings.route.js"
import paymentTable from "./src/routes/payment.route.js"
import reviewTable from "./src/routes/review.route.js"
import aiRoute from "./src/routes/ai.route.js"
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/admin/user", userTable)
app.use("/api/admin/property", propertyTable)
app.use("/api/admin/bookings", bookingsTable)
app.use("/api/admin/payment", paymentTable)
app.use("/api/admin/reviews", reviewTable)
app.use('/api/admin/ai', aiRoute)






export default app
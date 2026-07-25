import { chatWithAI, searchProperties } from '../services/ai.service.js'

export const chat = async (req, res) => {
    try {
        const { message } = req.body

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message required"
            })
        }

        const result = await chatWithAI(message)

        return res.status(200).json({
            success: true,
            response: result.response,
            suggestions: result.suggestions
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "AI service se connect nahi ho saka"
        })
    }
}

export const searchAI = async (req, res) => {
    try {
        const { query } = req.body

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query required"
            })
        }

        const result = await searchProperties(query)

        return res.status(200).json({
            success: true,
            query: result.query,
            response: result.response,
            properties: result.properties
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "AI service se connect nahi ho saka"
        })
    }
}
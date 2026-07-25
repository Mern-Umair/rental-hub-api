import fetch from 'node-fetch'

const AI_API_URL = 'http://127.0.0.1:5001'

export const chatWithAI = async (message) => {
    const response = await fetch(`${AI_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    return await response.json()
}

export const searchProperties = async (query) => {
    const response = await fetch(`${AI_API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    })
    return await response.json()
}
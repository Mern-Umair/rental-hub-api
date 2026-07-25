import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const aiApi = createApi({
    reducerPath: 'aiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
        chat: builder.mutation({
            query: (data) => ({
                url: '/ai/chat',
                method: 'POST',
                body: data
            })
        }),
        searchAI: builder.mutation({
            query: (data) => ({
                url: '/ai/search',
                method: 'POST',
                body: data
            })
        }),
    })
})

export const {
    useChatMutation,
    useSearchAIMutation
} = aiApi
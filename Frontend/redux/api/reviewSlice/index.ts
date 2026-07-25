import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
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
        createReview: builder.mutation({
            query: (data) => ({
                url: '/review/create',
                method: 'POST',
                body: data
            })
        }),
        getReviews: builder.query({
            query: (property_id) => `/review/get/${property_id}`
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/review/delete/${id}`,
                method: 'DELETE'
            })
        }),
    })
})

export const {
    useCreateReviewMutation,
    useGetReviewsQuery,
    useDeleteReviewMutation
} = reviewApi
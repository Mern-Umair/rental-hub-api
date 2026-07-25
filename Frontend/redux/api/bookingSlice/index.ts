import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
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
        createBooking: builder.mutation({
            query: (data) => ({
                url: '/bookings/create/bookings',
                method: 'POST',
                body: data
            })
        }),
        getBookings: builder.query({
            query: () => '/bookings/get/bookings'
        }),
        getBookingById: builder.query({
            query: (id) => `/bookings/get/${id}`
        }),
        updateBookingStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/bookings/status/${id}`,
                method: 'PATCH',
                body: data
            })
        }),
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/cancel/${id}`,
                method: 'PATCH'
            })
        }),
    })
})

export const {
    useCreateBookingMutation,
    useGetBookingsQuery,
    useGetBookingByIdQuery,
    useUpdateBookingStatusMutation,
    useCancelBookingMutation
} = bookingApi
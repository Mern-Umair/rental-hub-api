import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
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
        createPayment: builder.mutation({
            query: (data) => ({
                url: '/payment/create',
                method: 'POST',
                body: data
            })
        }),
        getAllPayments: builder.query({
            query: () => '/payment/get'
        }),
        getPaymentById: builder.query({
            query: (id) => `/payment/get/${id}`
        }),
        updatePaymentStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/payment/status/${id}`,
                method: 'PATCH',
                body: data
            })
        }),
    })
})

export const {
    useCreatePaymentMutation,
    useGetAllPaymentsQuery,
    useGetPaymentByIdQuery,
    useUpdatePaymentStatusMutation
} = paymentApi
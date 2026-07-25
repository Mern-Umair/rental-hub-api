import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
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
        signup: builder.mutation({
            query: (data) => ({
                url: '/user/signup',
                method: 'POST',
                body: data
            })
        }),
        login: builder.mutation({
            query: (data) => ({
                url: '/user/login',
                method: 'POST',
                body: data
            })
        }),
        getProfile: builder.query({
            query: () => '/user/get/profile'
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/user/update/profile',
                method: 'PATCH',
                body: data
            })
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/user/update/password',
                method: 'PATCH',
                body: data
            })
        }),
        getAllUsers: builder.query({
            query: () => '/user/get'
        }),
    })
})

export const {
    useSignupMutation,
    useLoginMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useGetAllUsersQuery
} = authApi
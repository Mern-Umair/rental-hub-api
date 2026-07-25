import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const propertyApi = createApi({
    reducerPath: 'propertyApi',
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
        addProperty: builder.mutation({
            query: (data) => ({
                url: '/property/add',
                method: 'POST',
                body: data
            })
        }),
        getAllProperties: builder.query({
            query: () => '/property/get'
        }),
        getPropertyById: builder.query({
            query: (id) => `/property/get/${id}`
        }),
        updateProperty: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/property/update/${id}`,
                method: 'PATCH',
                body: data
            })
        }),
        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/property/delete/${id}`,
                method: 'DELETE'
            })
        }),
    })
})

export const {
    useAddPropertyMutation,
    useGetAllPropertiesQuery,
    useGetPropertyByIdQuery,
    useUpdatePropertyMutation,
    useDeletePropertyMutation
} = propertyApi
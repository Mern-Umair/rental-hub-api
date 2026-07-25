import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/authSlidce'
import { paymentApi } from './api/paymentSlice'
import { propertyApi } from './api/propertySlice'
import { aiApi } from './api/aiSlice'
import { bookingApi } from './api/bookingSlice'
import { reviewApi } from './api/reviewSlice'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
        [aiApi.reducerPath]: aiApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,




    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(paymentApi.middleware)
            .concat(propertyApi.middleware)
            .concat(aiApi.middleware)
            .concat(bookingApi.middleware)
            .concat(reviewApi.middleware)




})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
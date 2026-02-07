import userSlice from './userSlice.js'
import productSlice from './productSlice.js'
import cartSlice from './cartSlice.js'
import orderSlice from './orderSlice.js'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {

  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'viralvastu',
  version: 1,
  storage,
}


const rootReducer = combineReducers({
  user: userSlice,
  products: productSlice,
  cart: cartSlice,
  orders:orderSlice



})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store
import { configureStore } from '@reduxjs/toolkit'
import schemaSlice from './slices/schemaSlice'
import projectSlice from './slices/projectSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    schemas: schemaSlice,
    projects: projectSlice,
    ui: uiSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
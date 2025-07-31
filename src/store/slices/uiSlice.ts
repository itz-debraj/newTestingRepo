// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface Toast {
//   id: string
//   message: string
//   type: 'success' | 'error' | 'info' | 'warning'
// }

// interface UIState {
//   sidebarOpen: boolean
//   theme: 'light' | 'dark' | 'system'
//   toasts: Toast[]
// }

// const initialState: UIState = {
//   sidebarOpen: true,
//   theme: 'system',
//   toasts: [],
// }

// const uiSlice = createSlice({
//   name: 'ui',
//   initialState,
//   reducers: {
//     toggleSidebar: (state) => {
//       state.sidebarOpen = !state.sidebarOpen
//     },
//     setSidebarOpen: (state, action: PayloadAction<boolean>) => {
//       state.sidebarOpen = action.payload
//     },
//     setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
//       state.theme = action.payload
//     },
//     addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
//       const toast: Toast = {
//         ...action.payload,
//         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       }
//       state.toasts.push(toast)
//     },
//     removeToast: (state, action: PayloadAction<string>) => {
//       state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
//     },
//   },
// })

// export const { toggleSidebar, setSidebarOpen, setTheme, addToast, removeToast } = uiSlice.actions
// export default uiSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface UIState {
  theme: 'light' | 'dark' | 'system'
  toasts: Toast[]
}

const initialState: UIState = {
  theme: 'system',
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }
      state.toasts.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
  },
})

export const { setTheme, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer
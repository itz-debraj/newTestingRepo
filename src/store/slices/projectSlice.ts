import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ProjectDataRow {
  rowId: string
  [key: string]: any
}

export interface ProjectSchemaData {
  schemaId: string
  data: ProjectDataRow[]
}

interface ProjectState {
  configuredSchemas: string[]
  projectData: { [schemaId: string]: ProjectDataRow[] }
  selectedSchemaId: string | null
  loading: boolean
  error: string | null
}

const initialState: ProjectState = {
  configuredSchemas: [],
  projectData: {},
  selectedSchemaId: null,
  loading: false,
  error: null,
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addSchemasToProject: (state, action: PayloadAction<string[]>) => {
      const newSchemas = action.payload.filter(id => !state.configuredSchemas.includes(id))
      state.configuredSchemas.push(...newSchemas)
      
      // Initialize empty data arrays for new schemas
      newSchemas.forEach(schemaId => {
        if (!state.projectData[schemaId]) {
          state.projectData[schemaId] = []
        }
      })
    },
    removeSchemaFromProject: (state, action: PayloadAction<string>) => {
      state.configuredSchemas = state.configuredSchemas.filter(id => id !== action.payload)
      delete state.projectData[action.payload]
      if (state.selectedSchemaId === action.payload) {
        state.selectedSchemaId = null
      }
    },
    setSelectedSchemaId: (state, action: PayloadAction<string | null>) => {
      state.selectedSchemaId = action.payload
    },
    addDataRow: (state, action: PayloadAction<{ schemaId: string; data: Omit<ProjectDataRow, 'rowId'> }>) => {
      const { schemaId, data } = action.payload
      const newRow: ProjectDataRow = {
        ...data,
        rowId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }
      
      if (!state.projectData[schemaId]) {
        state.projectData[schemaId] = []
      }
      state.projectData[schemaId].push(newRow)
    },
    updateDataRow: (state, action: PayloadAction<{ schemaId: string; rowId: string; data: Partial<ProjectDataRow> }>) => {
      const { schemaId, rowId, data } = action.payload
      if (state.projectData[schemaId]) {
        const rowIndex = state.projectData[schemaId].findIndex(row => row.rowId === rowId)
        if (rowIndex !== -1) {
          state.projectData[schemaId][rowIndex] = { ...state.projectData[schemaId][rowIndex], ...data }
        }
      }
    },
    deleteDataRow: (state, action: PayloadAction<{ schemaId: string; rowId: string }>) => {
      const { schemaId, rowId } = action.payload
      if (state.projectData[schemaId]) {
        state.projectData[schemaId] = state.projectData[schemaId].filter(row => row.rowId !== rowId)
      }
    },
    setProjectData: (state, action: PayloadAction<{ schemaId: string; data: ProjectDataRow[] }>) => {
      const { schemaId, data } = action.payload
      state.projectData[schemaId] = data
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  addSchemasToProject,
  removeSchemaFromProject,
  setSelectedSchemaId,
  addDataRow,
  updateDataRow,
  deleteDataRow,
  setProjectData,
  setLoading,
  setError,
} = projectSlice.actions

export default projectSlice.reducer
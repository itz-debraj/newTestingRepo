import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SchemaField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percentage' | 'picklist' | 'array' | 'object'
  description: string
  required: boolean
  defaultValue: string
  picklistValues?: string
}

export interface Schema {
  id: string
  schemaName: string
  description: string
  fields: SchemaField[]
  createdAt: string
}

interface SchemaState {
  schemas: Schema[]
  loading: boolean
  error: string | null
}

const initialState: SchemaState = {
  schemas: [
    {
      id: 'g1',
      schemaName: 'Product Attributes',
      description: 'Schema for product-related data',
      fields: [
        { name: 'productId', type: 'string', required: true, defaultValue: '', description: 'Unique product identifier' },
        { name: 'productName', type: 'string', required: true, defaultValue: '', description: 'Product name' },
        { name: 'category', type: 'picklist', picklistValues: 'Electronics,Apparel,Books,Home Goods', defaultValue: '', description: 'Product category', required: false }
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g2',
      schemaName: 'Customer Profile',
      description: 'Schema for customer information',
      fields: [
        { name: 'customerId', type: 'string', required: true, defaultValue: '', description: 'Unique customer identifier' },
        { name: 'fullName', type: 'string', required: true, defaultValue: '', description: 'Customer full name' },
        { name: 'email', type: 'string', defaultValue: '', description: 'Customer email', required: false },
        { name: 'membershipTier', type: 'picklist', picklistValues: 'Bronze,Silver,Gold', defaultValue: '', description: 'Membership level', required: false }
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g3',
      schemaName: 'Bonds',
      description: 'Schema for financial bonds details',
      fields: [
        { name: 'Type', type: 'string', required: true, defaultValue: '', description: 'Bond type' },
        { name: 'Issue', type: 'picklist', picklistValues: 'Open Ended,Fixed Term', defaultValue: '', description: 'Issue type', required: false },
        { name: 'Cost % per Mth', type: 'number', required: true, defaultValue: '0', description: 'Monthly cost percentage' }
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g4',
      schemaName: 'Contract Summary',
      description: 'Schema for contract overview',
      fields: [
        { name: 'contractId', type: 'string', required: true, defaultValue: '', description: 'Contract identifier' },
        { name: 'startDate', type: 'date', defaultValue: '', description: 'Contract start date', required: false },
        { name: 'endDate', type: 'date', defaultValue: '', description: 'Contract end date', required: false },
        { name: 'totalValue', type: 'currency', defaultValue: '0', description: 'Total contract value', required: false }
      ],
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
}

const schemaSlice = createSlice({
  name: 'schemas',
  initialState,
  reducers: {
    addSchema: (state, action: PayloadAction<Omit<Schema, 'id' | 'createdAt'>>) => {
      const newSchema: Schema = {
        ...action.payload,
        id: `g${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      state.schemas.push(newSchema)
    },
    deleteSchema: (state, action: PayloadAction<string>) => {
      state.schemas = state.schemas.filter(schema => schema.id !== action.payload)
    },
    updateSchema: (state, action: PayloadAction<Schema>) => {
      const index = state.schemas.findIndex(schema => schema.id === action.payload.id)
      if (index !== -1) {
        state.schemas[index] = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { addSchema, deleteSchema, updateSchema, setLoading, setError } = schemaSlice.actions
export default schemaSlice.reducer
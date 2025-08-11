'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { addDataRow, updateDataRow, deleteDataRow } from '@/store/slices/projectSlice'
import { addToast } from '@/store/slices/uiSlice'
import { Schema } from '@/store/slices/schemaSlice'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'
import { DataEntryModal } from './DataEntryModal'

interface SchemaDataSectionProps {
  schema: Schema
}

export function SchemaDataSection({ schema }: SchemaDataSectionProps) {
  const projectData = useAppSelector(state => state.projects.projectData)
  const dispatch = useAppDispatch()
  
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<any>(null)
  
  const currentSchemaData = projectData[schema.id] || []

  const handleAddData = () => {
    setEditingRow(null)
    setIsDataModalOpen(true)
  }

  const handleEditData = (row: any) => {
    setEditingRow(row)
    setIsDataModalOpen(true)
  }

  const handleSaveData = (data: any) => {
    if (editingRow) {
      dispatch(updateDataRow({
        schemaId: schema.id,
        rowId: editingRow.rowId,
        data
      }))
      dispatch(addToast({ message: 'Data updated successfully!', type: 'success' }))
    } else {
      dispatch(addDataRow({
        schemaId: schema.id,
        data
      }))
      dispatch(addToast({ message: 'Data added successfully!', type: 'success' }))
    }
    setIsDataModalOpen(false)
    setEditingRow(null)
  }

  const handleDeleteData = (rowId: string) => {
    dispatch(deleteDataRow({ schemaId: schema.id, rowId }))
    dispatch(addToast({ message: 'Data deleted successfully!', type: 'success' }))
  }

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      dispatch(addToast({ message: `Excel file "${file.name}" uploaded! (Mock functionality)`, type: 'info' }))
      
      // Mock data based on schema
      if (schema.schemaName === 'Bonds') {
        const mockData = [
          { 'Type': 'Advance Payment Guarantee', 'Issue': 'Open Ended', 'Cost % per Mth': 0.1 },
          { 'Type': 'Performance Bond', 'Issue': 'Fixed Term', 'Cost % per Mth': 0.1 },
          { 'Type': 'Retention Bond', 'Issue': 'Fixed Term', 'Cost % per Mth': 0.1 }
        ]
        mockData.forEach(data => {
          dispatch(addDataRow({ schemaId: schema.id, data }))
        })
      } else if (schema.schemaName === 'Product Attributes') {
        const mockData = [
          { 'productId': 'P001', 'productName': 'Smartwatch X', 'category': 'Electronics' },
          { 'productId': 'P002', 'productName': 'Running Shoes', 'category': 'Apparel' },
        ]
        mockData.forEach(data => {
          dispatch(addDataRow({ schemaId: schema.id, data }))
        })
      }
      
      event.target.value = ''
    }
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-3">
        {schema.schemaName} Data
      </h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Enter or upload data for the fields defined in the {schema.schemaName} schema.
      </p>

      <div className="flex flex-col md:flex-row justify-end gap-3 mb-4">
        <Button onClick={handleAddData}>
          <Plus className="h-4 w-4 mr-2" />
          Add Data Row
        </Button>
        
        <label className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Upload Excel (Mock)
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
          />
        </label>
      </div>

      {/* Data Table */}
      {currentSchemaData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {schema.fields.map(field => (
                <TableHead key={field.name}>{field.name}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSchemaData.map((row) => (
              <TableRow key={row.rowId}>
                {schema.fields.map(field => (
                  <TableCell key={`${row.rowId}-${field.name}`}>
                    {row[field.name]?.toString() || ''}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditData(row)}
                      variant="secondary"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteData(row.rowId)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg border border-border text-center">
          No data entered for this schema yet. Use "Add Data Row" or "Upload Excel".
        </p>
      )}

      <DataEntryModal
        isOpen={isDataModalOpen}
        onClose={() => {
          setIsDataModalOpen(false)
          setEditingRow(null)
        }}
        onSave={handleSaveData}
        schema={schema}
        initialData={editingRow}
      />
    </div>
  )
}
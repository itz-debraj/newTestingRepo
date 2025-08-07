'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { addSchema, deleteSchema, SchemaField } from '@/store/slices/schemaSlice'
import { addToast } from '@/store/slices/uiSlice'
import { Plus, Trash2, Sparkles, Upload } from 'lucide-react'

export function SchemaConfig() {
  const schemas = useAppSelector(state => state.schemas.schemas)
  const dispatch = useAppDispatch()

  const [schemaName, setSchemaName] = useState('')
  const [schemaDescription, setSchemaDescription] = useState('')
  const [fields, setFields] = useState<SchemaField[]>([
    { name: '', type: 'string', description: '', required: false, defaultValue: '', picklistValues: '' }
  ])

  const handleAddField = () => {
    setFields([...fields, { name: '', type: 'string', description: '', required: false, defaultValue: '', picklistValues: '' }])
  }

  const handleFieldChange = (index: number, field: keyof SchemaField, value: any) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [field]: value }
    setFields(newFields)
  }

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!schemaName.trim()) {
      dispatch(addToast({ message: 'Schema name is required', type: 'error' }))
      return
    }

    const validFields = fields.filter(f => f.name.trim() !== '')
    if (validFields.length === 0) {
      dispatch(addToast({ message: 'At least one field is required', type: 'error' }))
      return
    }

    dispatch(addSchema({
      schemaName,
      description: schemaDescription,
      fields: validFields,
    }))

    dispatch(addToast({ message: 'Schema created successfully!', type: 'success' }))
    
    // Reset form
    setSchemaName('')
    setSchemaDescription('')
    setFields([{ name: '', type: 'string', description: '', required: false, defaultValue: '', picklistValues: '' }])
  }

  const handleDelete = (id: string) => {
    dispatch(deleteSchema(id))
    dispatch(addToast({ message: 'Schema deleted successfully!', type: 'success' }))
  }

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      dispatch(addToast({ message: `Excel file "${file.name}" uploaded! (Mock functionality)`, type: 'info' }))
      // Mock field addition
      const mockFields: SchemaField[] = [
        { name: 'excelField1', type: 'string', description: 'From Excel', required: false, defaultValue: '', picklistValues: '' },
        { name: 'excelField2', type: 'number', description: 'From Excel', required: true, defaultValue: '0', picklistValues: '' },
      ]
      setFields(prevFields => [...prevFields, ...mockFields])
      event.target.value = ''
    }
  }

  return (
    <div className="p-2 md:p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Schema Configuration</h2>
      <p className="text-muted-foreground mb-6">
        Define and manage your application's custom data schemas. This microservice is designed to be domain-agnostic.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Schema Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Schema</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="schemaName">Schema Name</Label>
                <Input
                  id="schemaName"
                  value={schemaName}
                  onChange={(e) => setSchemaName(e.target.value)}
                  placeholder="e.g., Product Attributes, User Settings"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="schemaDescription">Description</Label>
                <Textarea
                  id="schemaDescription"
                  value={schemaDescription}
                  onChange={(e) => setSchemaDescription(e.target.value)}
                  rows={3}
                  placeholder="A brief description of this metadata schema."
                />
              </div>

              <h4 className="text-lg font-semibold text-foreground mt-6 mb-3 border-b border-border pb-2">
                Fields
              </h4>
              
              {fields.map((field, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-background shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`fieldName-${index}`}>Field Name</Label>
                      <Input
                        id={`fieldName-${index}`}
                        value={field.name}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        placeholder="e.g., itemCode, isActive"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`fieldType-${index}`}>Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => handleFieldChange(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="currency">Currency</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="picklist">Picklist</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor={`fieldDescription-${index}`}>Description</Label>
                      <Input
                        id={`fieldDescription-${index}`}
                        value={field.description}
                        onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                        placeholder="e.g., Unique identifier for the item"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`fieldRequired-${index}`}
                        checked={field.required}
                        onCheckedChange={(checked) => handleFieldChange(index, 'required', checked)}
                      />
                      <Label htmlFor={`fieldRequired-${index}`}>Required</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor={`defaultValue-${index}`}>Default Value</Label>
                      <Input
                        id={`defaultValue-${index}`}
                        value={field.defaultValue}
                        onChange={(e) => handleFieldChange(index, 'defaultValue', e.target.value)}
                        placeholder="e.g., N/A, 0"
                      />
                    </div>
                    
                    {field.type === 'picklist' && (
                      <div className="md:col-span-2">
                        <Label htmlFor={`picklistValues-${index}`}>Picklist Values (comma-separated)</Label>
                        <Textarea
                          id={`picklistValues-${index}`}
                          value={field.picklistValues || ''}
                          onChange={(e) => handleFieldChange(index, 'picklistValues', e.target.value)}
                          rows={2}
                          placeholder="e.g., Active,Inactive,Pending"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        dispatch(addToast({ message: 'AI field enhancement is a mock feature', type: 'info' }))
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Enhance
                    </Button>
                    
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <Button type="button" onClick={handleAddField} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
                
                <Label htmlFor="excel-upload" className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Fields (Excel)
                  <input
                    type="file"
                    id="excel-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                  />
                </Label>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    dispatch(addToast({ message: 'AI schema suggestion is a mock feature', type: 'info' }))
                  }}
                  className="w-full md:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Suggestion
                </Button>
              </div>
              
              <Button type="submit" className="w-full mt-6">
                Save Schema
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Schemas List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Schemas</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {schemas.length === 0 ? (
              <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg">
                No schemas configured yet. Start by creating one!
              </p>
            ) : (
              <div className="space-y-4">
                {schemas.map((schema) => (
                  <Card key={schema.id}>
                    <CardContent className="p-4 flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-foreground">{schema.schemaName}</h3>
                        <p className="text-sm text-muted-foreground">{schema.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fields: {schema.fields.map(f => f.name).join(', ')}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDelete(schema.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
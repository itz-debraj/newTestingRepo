'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppSelector} from '@/hooks/useAppSelector'
import { addSchema, deleteSchema, SchemaField } from '@/store/slices/schemaSlice'
import { addToast } from '@/store/slices/uiSlice'
import { Plus, Trash2, Sparkles, Upload, Settings, Calendar, Hash, DollarSign, Percent, List, Layers, Package, ChevronDown, ChevronRight, Eye, EyeOff, Search } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function SchemaConfig() {
  const schemas = useAppSelector(state => state.schemas.schemas)
  const dispatch = useAppDispatch()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [schemaName, setSchemaName] = useState('')
  const [schemaDescription, setSchemaDescription] = useState('')
  const [fields, setFields] = useState<SchemaField[]>([
    { name: '', type: 'string', description: '', required: false, defaultValue: '', picklistValues: '' }
  ])
  const [expandedFields, setExpandedFields] = useState<{ [key: number]: boolean }>({ 0: true })
  const [fieldSearchTerm, setFieldSearchTerm] = useState('')
  const [allFieldsExpanded, setAllFieldsExpanded] = useState(false)

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(fieldSearchTerm.toLowerCase()) ||
    field.type.toLowerCase().includes(fieldSearchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(fieldSearchTerm.toLowerCase())
  )

  const handleAddField = () => {
    const newIndex = fields.length
    setFields([...fields, { name: '', type: 'string', description: '', required: false, defaultValue: '', picklistValues: '' }])
    setExpandedFields(prev => ({ ...prev, [newIndex]: true }))
  }

  const handleFieldChange = (index: number, field: keyof SchemaField, value: any) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [field]: value }
    setFields(newFields)
  }

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
    // Update expanded fields indices
    const newExpandedFields: { [key: number]: boolean } = {}
    Object.keys(expandedFields).forEach(key => {
      const keyIndex = parseInt(key)
      if (keyIndex < index) {
        newExpandedFields[keyIndex] = expandedFields[keyIndex]
      } else if (keyIndex > index) {
        newExpandedFields[keyIndex - 1] = expandedFields[keyIndex]
      }
    })
    setExpandedFields(newExpandedFields)
  }

  const toggleFieldExpanded = (index: number) => {
    setExpandedFields(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleAllFields = () => {
    const newState = !allFieldsExpanded
    setAllFieldsExpanded(newState)
    const newExpandedFields: { [key: number]: boolean } = {}
    fields.forEach((_, index) => {
      newExpandedFields[index] = newState
    })
    setExpandedFields(newExpandedFields)
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
    
    // Reset form and close modal
    setSchemaName('')
    setSchemaDescription('')
    setFields([{ name: '', type: 'string', description: '', required: false, defaultValue: '', picklistValues: '' }])
    setExpandedFields({ 0: true })
    setFieldSearchTerm('')
    setAllFieldsExpanded(false)
    setIsCreateModalOpen(false)
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
      const startIndex = fields.length
      setFields(prevFields => [...prevFields, ...mockFields])
      // Expand new fields
      const newExpanded = { ...expandedFields }
      mockFields.forEach((_, index) => {
        newExpanded[startIndex + index] = true
      })
      setExpandedFields(newExpanded)
      event.target.value = ''
    }
  }

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'string': return <Package className="h-4 w-4" />
      case 'number': return <Hash className="h-4 w-4" />
      case 'boolean': return <Settings className="h-4 w-4" />
      case 'date': return <Calendar className="h-4 w-4" />
      case 'currency': return <DollarSign className="h-4 w-4" />
      case 'percentage': return <Percent className="h-4 w-4" />
      case 'picklist': return <List className="h-4 w-4" />
      case 'array': return <Layers className="h-4 w-4" />
      case 'object': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'archived':
        return <Badge variant="outline" className="text-gray-500">Archived</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const [showAllFields, setShowAllFields] = useState<{ [key: string]: boolean }>({})

  const toggleShowAllFields = (schemaId: string) => {
    setShowAllFields(prev => ({
      ...prev,
      [schemaId]: !prev[schemaId]
    }))
  }

  return (
    <div className="p-2 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Schema Configuration</h2>
          <p className="text-muted-foreground">
            Define and manage your application's custom data schemas. This microservice is designed to be domain-agnostic.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="ml-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Schema
        </Button>
      </div>

      {/* Schemas Grid */}
      {schemas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No schemas configured yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Get started by creating your first metadata schema. Define custom fields and data structures for your application.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Schema
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <Card key={schema.id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{schema.schemaName}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {schema.description || 'No description provided'}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(schema.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  {getStatusBadge(schema.status)}
                  <span className="text-xs text-muted-foreground">
                    {schema.fields.length} field{schema.fields.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 flex-1">
                <div className="space-y-3">
                  {/* Schema Statistics */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Schema Overview</h4>
                    
                    {/* Field Statistics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-primary">{schema.fields.length}</div>
                        <div className="text-xs text-muted-foreground">Total Fields</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {schema.fields.filter(f => f.required).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Required</div>
                      </div>
                    </div>

                    {/* Field Type Distribution */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Field Types</div>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const typeCount = schema.fields.reduce((acc, field) => {
                            acc[field.type] = (acc[field.type] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          return Object.entries(typeCount).slice(0, 4).map(([type, count]) => (
                            <div key={type} className="flex items-center space-x-1 bg-accent/50 rounded px-2 py-1">
                              {getFieldTypeIcon(type)}
                              <span className="text-xs font-medium capitalize">{type}</span>
                              <span className="text-xs text-muted-foreground">({count})</span>
                            </div>
                          ));
                        })()}
                        {(() => {
                          const typeCount = schema.fields.reduce((acc, field) => {
                            acc[field.type] = (acc[field.type] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          const remainingTypes = Object.keys(typeCount).length - 4;
                          return remainingTypes > 0 ? (
                            <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                              +{remainingTypes} more
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Created {new Date(schema.createdAt).toLocaleDateString()}</span>
                      <span>Updated {new Date(schema.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Schema Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Schema</DialogTitle>
            <DialogDescription>
              Define a new metadata schema with custom fields and validation rules.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Schema Basic Info Section */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Schema Information</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Basic details about your schema</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schemaName" className="text-sm font-medium">Schema Name *</Label>
                    <Input
                      id="schemaName"
                      value={schemaName}
                      onChange={(e) => setSchemaName(e.target.value)}
                      placeholder="e.g., Product Attributes, User Settings"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schemaDescription" className="text-sm font-medium">Description</Label>
                    <Input
                      id="schemaDescription"
                      value={schemaDescription}
                      onChange={(e) => setSchemaDescription(e.target.value)}
                      placeholder="Brief description of this schema"
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fields Section */}
            <Card className="flex-1 min-h-0 flex flex-col pt-0">
              <CardHeader className="rounded-tl-xl rounded-tr-xl p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Schema Fields</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {fields.length} field{fields.length !== 1 ? 's' : ''} • {fields.filter(f => f.required).length} required
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search fields..."
                        value={fieldSearchTerm}
                        onChange={(e) => setFieldSearchTerm(e.target.value)}
                        className="pl-10 w-64 h-9"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleAllFields}
                      title={allFieldsExpanded ? "Collapse All" : "Expand All"}
                      className="h-9"
                    >
                      {allFieldsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleAddField}
                      variant="outline"
                      // className="w-full h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Field
                    </Button>
                    
                    <Label htmlFor="excel-upload" className="inline-flex items-center px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer h-9">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Excel
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
                      size="sm"
                      onClick={() => {
                        dispatch(addToast({ message: 'AI schema suggestion is a mock feature', type: 'info' }))
                      }}
                      className="h-9"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Suggest
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 min-h-0 p-0">
                <div className="flex flex-col h-full">
                  <ScrollArea className="h-[25vh] p-6 py-0">
                    <div className="space-y-4">
                      {filteredFields.length === 0 ? (
                        <div className="text-center py-12">
                          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <p className="text-muted-foreground">
                            {fieldSearchTerm ? 'No fields match your search' : 'No fields added yet'}
                          </p>
                        </div>
                      ) : (
                        filteredFields.map((field, index) => {
                          const originalIndex = fields.findIndex(f => f === field)
                          return (
                            <Collapsible
                              key={originalIndex}
                              open={expandedFields[originalIndex]}
                              onOpenChange={() => toggleFieldExpanded(originalIndex)}
                            >
                              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                                <CollapsibleTrigger asChild>
                                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        {expandedFields[originalIndex] ? (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                          {getFieldTypeIcon(field.type)}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2">
                                            <h4 className="font-semibold text-base">
                                              {field.name || `Field ${originalIndex + 1}`}
                                            </h4>
                                            {field.required && (
                                              <Badge variant="destructive" className="text-xs px-2 py-0">Required</Badge>
                                            )}
                                            <Badge variant="secondary" className="text-xs px-2 py-0 capitalize">
                                              {field.type}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {field.description || 'No description provided'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(addToast({ message: 'AI field enhancement is a mock feature', type: 'info' }))
                                          }}
                                          className="h-8"
                                        >
                                          <Sparkles className="h-4 w-4" />
                                        </Button>
                                        
                                        {fields.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleRemoveField(originalIndex)
                                            }}
                                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </CardHeader>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                  <CardContent className="pt-0 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`fieldName-${originalIndex}`} className="text-sm font-medium">Field Name *</Label>
                                        <Input
                                          id={`fieldName-${originalIndex}`}
                                          value={field.name}
                                          onChange={(e) => handleFieldChange(originalIndex, 'name', e.target.value)}
                                          placeholder="e.g., itemCode, isActive"
                                          required
                                          className="h-10"
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor={`fieldType-${originalIndex}`} className="text-sm font-medium">Type</Label>
                                        <Select
                                          value={field.type}
                                          onValueChange={(value) => handleFieldChange(originalIndex, 'type', value)}
                                        >
                                          <SelectTrigger className="h-10">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="string">
                                              <div className="flex items-center space-x-2">
                                                <Package className="h-4 w-4" />
                                                <span>String</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="number">
                                              <div className="flex items-center space-x-2">
                                                <Hash className="h-4 w-4" />
                                                <span>Number</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="boolean">
                                              <div className="flex items-center space-x-2">
                                                <Settings className="h-4 w-4" />
                                                <span>Boolean</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="date">
                                              <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Date</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="currency">
                                              <div className="flex items-center space-x-2">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Currency</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="percentage">
                                              <div className="flex items-center space-x-2">
                                                <Percent className="h-4 w-4" />
                                                <span>Percentage</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="picklist">
                                              <div className="flex items-center space-x-2">
                                                <List className="h-4 w-4" />
                                                <span>Picklist</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="array">
                                              <div className="flex items-center space-x-2">
                                                <Layers className="h-4 w-4" />
                                                <span>Array</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="object">
                                              <div className="flex items-center space-x-2">
                                                <Package className="h-4 w-4" />
                                                <span>Object</span>
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor={`defaultValue-${originalIndex}`} className="text-sm font-medium">Default Value</Label>
                                        <Input
                                          id={`defaultValue-${originalIndex}`}
                                          value={field.defaultValue}
                                          onChange={(e) => handleFieldChange(originalIndex, 'defaultValue', e.target.value)}
                                          placeholder="e.g., N/A, 0"
                                          className="h-10"
                                        />
                                      </div>
                                      
                                      <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor={`fieldDescription-${originalIndex}`} className="text-sm font-medium">Description</Label>
                                        <Input
                                          id={`fieldDescription-${originalIndex}`}
                                          value={field.description}
                                          onChange={(e) => handleFieldChange(originalIndex, 'description', e.target.value)}
                                          placeholder="e.g., Unique identifier for the item"
                                          className="h-10"
                                        />
                                      </div>
                                      
                                      <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`fieldRequired-${originalIndex}`}
                                            checked={field.required}
                                            onCheckedChange={(checked) => handleFieldChange(originalIndex, 'required', checked)}
                                          />
                                          <Label htmlFor={`fieldRequired-${originalIndex}`} className="text-sm font-medium">Required Field</Label>
                                        </div>
                                      </div>
                                      
                                      {field.type === 'picklist' && (
                                        <div className="space-y-2 md:col-span-3">
                                          <Label htmlFor={`picklistValues-${originalIndex}`} className="text-sm font-medium">Picklist Values</Label>
                                          <Textarea
                                            id={`picklistValues-${originalIndex}`}
                                            value={field.picklistValues || ''}
                                            onChange={(e) => handleFieldChange(originalIndex, 'picklistValues', e.target.value)}
                                            rows={3}
                                            placeholder="Enter comma-separated values: Active, Inactive, Pending"
                                            className="resize-none"
                                          />
                                          <p className="text-xs text-muted-foreground">
                                            Separate multiple values with commas
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </CollapsibleContent>
                              </Card>
                            </Collapsible>
                          )
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>

              
            </Card>

            <DialogFooter className="mt-6 pt-4 border-t bg-muted/30">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="min-w-[120px]">
                Create Schema
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      

    </div>
  )
}
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Trash2, Sparkles, Upload, Settings, Calendar, Hash, DollarSign, Percent, List, Layers, Package, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react'
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
      {/* <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Schema</DialogTitle>
            <DialogDescription>
              Define a new metadata schema with custom fields and validation rules.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                <Input
                  id="schemaDescription"
                  value={schemaDescription}
                  onChange={(e) => setSchemaDescription(e.target.value)}
                  placeholder="Brief description of this schema"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Fields</h4>
                <div className="flex gap-2">
                  <Label htmlFor="excel-upload" className="inline-flex items-center px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Excel
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
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Suggestion
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Collapsible
                      key={index}
                      open={expandedFields[index]}
                      onOpenChange={() => toggleFieldExpanded(index)}
                    >
                      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {expandedFields[index] ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                {getFieldTypeIcon(field.type)}
                                <div>
                                  <h4 className="font-medium">
                                    {field.name || `Field ${index + 1}`}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                  </h4>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {field.type} {field.description && `• ${field.description}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
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
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRemoveField(index)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              
                              <div>
                                <Label htmlFor={`defaultValue-${index}`}>Default Value</Label>
                                <Input
                                  id={`defaultValue-${index}`}
                                  value={field.defaultValue}
                                  onChange={(e) => handleFieldChange(index, 'defaultValue', e.target.value)}
                                  placeholder="e.g., N/A, 0"
                                />
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
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`fieldRequired-${index}`}
                                    checked={field.required}
                                    onCheckedChange={(checked) => handleFieldChange(index, 'required', checked)}
                                  />
                                  <Label htmlFor={`fieldRequired-${index}`}>Required</Label>
                                </div>
                              </div>
                              
                              {field.type === 'picklist' && (
                                <div className="md:col-span-3">
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
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-4 border-t">
                <Button
                  type="button"
                  onClick={handleAddField}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Schema
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-7xl h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Schema</DialogTitle>
            <DialogDescription>
              Define a new metadata schema with custom fields and validation rules.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-1 gap-6 overflow-hidden">
            {/* Left column - Form */}
            <div className="flex-[2] flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 pr-4">
                {/* Schema Basics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    <Input
                      id="schemaDescription"
                      value={schemaDescription}
                      onChange={(e) => setSchemaDescription(e.target.value)}
                      placeholder="Brief description of this schema"
                    />
                  </div>
                </div>

                {/* Fields Section */}
                <div className="flex justify-between items-center mb-4">
                  <Label htmlFor="excel-upload" className="cursor-pointer flex items-center px-3 py-2 bg-accent rounded-md">
                    <Upload className="h-4 w-4 mr-2" /> Upload Excel
                    <input type="file" id="excel-upload" className="hidden" accept=".xlsx,.xls" onChange={handleExcelUpload} />
                  </Label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => dispatch(addToast({ message: 'AI schema suggestion is a mock feature', type: 'info' }))}
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> AI Suggestion
                  </Button>
                </div>

                {/* Fields list */}
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Collapsible
                      key={index}
                      open={expandedFields[index]}
                      onOpenChange={() => toggleFieldExpanded(index)}
                    >
                      <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {expandedFields[index] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                {getFieldTypeIcon(field.type)}
                                <span className="font-medium">{field.name || `Field ${index + 1}`}</span>
                              </div>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveField(index); }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <CardContent className="pt-0 space-y-4">
                            <div>
                              <Label>Field Name</Label>
                              <Input value={field.name} onChange={(e) => handleFieldChange(index, 'name', e.target.value)} />
                            </div>
                            <div>
                              <Label>Type</Label>
                              <Select value={field.type} onValueChange={(value) => handleFieldChange(index, 'type', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {['string', 'number', 'boolean', 'date', 'currency', 'percentage', 'picklist', 'array', 'object'].map((type) => (
                                    <SelectItem key={type} value={type}>
                                      <div className="flex items-center gap-2">
                                        {getFieldTypeIcon(type)}
                                        <span className="capitalize">{type}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {field.type === 'picklist' && (
                              <div>
                                <Label>Picklist Values</Label>
                                <Textarea
                                  value={field.picklistValues || ''}
                                  onChange={(e) => handleFieldChange(index, 'picklistValues', e.target.value)}
                                  placeholder="Comma-separated values"
                                />
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={handleAddField} className="mt-4 w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </Button>
              </ScrollArea>
            </div>

            {/* Right column - Live Preview */}
            <div className="flex-[1] bg-muted rounded-lg p-4 overflow-y-auto">
              <h4 className="font-semibold mb-3">Live Preview</h4>
              <Card>
                <CardContent className="space-y-3 pt-4">
                  {fields.map((f, i) => (
                    <div key={i}>
                      <Label className="flex items-center gap-2">
                        {getFieldTypeIcon(f.type)}
                        {f.name || `Field ${i + 1}`}
                      </Label>
                      <Input placeholder={f.defaultValue || ''} disabled />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </form>

          <DialogFooter className="sticky bottom-0 bg-background border-t py-3 mt-3">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Schema</Button>
          </DialogFooter>
        </DialogContent>

      </Dialog>

    </div>
  )
}
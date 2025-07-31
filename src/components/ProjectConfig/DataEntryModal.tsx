'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Schema } from '@/store/slices/schemaSlice'

import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { addToast } from '@/store/slices/uiSlice'

interface DataEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  schema: Schema
  initialData?: any
}

export function DataEntryModal({
  isOpen,
  onClose,
  onSave,
  schema,
  initialData,
}: DataEntryModalProps) {
  const [formData, setFormData] = useState<any>({})
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData })
    } else {
      // Initialize with default values
      const defaultData: any = {}
      schema.fields.forEach(field => {
        defaultData[field.name] = field.defaultValue || ''
      })
      setFormData(defaultData)
    }
  }, [initialData, schema])

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  const handleSave = () => {
    // Validate required fields
    const missingRequired = schema.fields.filter(
      field => field.required && (!formData[field.name] || formData[field.name] === '')
    )

    if (missingRequired.length > 0) {
      dispatch(addToast({
        message: `Please fill in required fields: ${missingRequired.map(f => f.name).join(', ')}`,
        type: 'error'
      }))
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Data' : 'Add Data'} for {schema.schemaName}
          </DialogTitle>
          <DialogDescription>
            Enter the data for the selected schema fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {schema.fields.map(field => (
            <div key={field.name}>
              <Label htmlFor={`data-entry-${field.name}`}>
                {field.name} {field.required && <span className="text-destructive">*</span>}
              </Label>
              
              {field.type === 'picklist' ? (
                <Select
                  value={formData[field.name] || ''}
                  onValueChange={(value) => handleFieldChange(field.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Select --</SelectItem>
                    {field.picklistValues?.split(',').map(val => (
                      <SelectItem key={val.trim()} value={val.trim()}>
                        {val.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'boolean' ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`data-entry-${field.name}`}
                    checked={formData[field.name] || false}
                    onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
                  />
                  <Label htmlFor={`data-entry-${field.name}`}>Yes</Label>
                </div>
              ) : field.type === 'date' ? (
                <Input
                  type="date"
                  id={`data-entry-${field.name}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                />
              ) : field.type === 'number' || field.type === 'currency' || field.type === 'percentage' ? (
                <Input
                  type="number"
                  step={field.type === 'percentage' ? '0.01' : field.type === 'currency' ? '0.01' : '1'}
                  id={`data-entry-${field.name}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.description}
                />
              ) : (
                <Input
                  type="text"
                  id={`data-entry-${field.name}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.description}
                />
              )}
              
              {field.description && (
                <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
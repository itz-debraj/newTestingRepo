'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Schema } from '@/store/slices/schemaSlice'

interface SchemaSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (schemaIds: string[]) => void
  availableSchemas: Schema[]
  configuredSchemas: string[]
}

export function SchemaSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  availableSchemas,
  configuredSchemas,
}: SchemaSelectionModalProps) {
  const [selectedSchemas, setSelectedSchemas] = useState<string[]>([])

  const handleSchemaToggle = (schemaId: string) => {
    setSelectedSchemas(prev =>
      prev.includes(schemaId)
        ? prev.filter(id => id !== schemaId)
        : [...prev, schemaId]
    )
  }

  const handleConfirm = () => {
    const newSchemas = selectedSchemas.filter(id => !configuredSchemas.includes(id))
    onConfirm(newSchemas)
    setSelectedSchemas([])
  }

  const handleClose = () => {
    setSelectedSchemas([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Schemas to Project</DialogTitle>
          <DialogDescription>
            Select the schemas you want to associate with this project.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {availableSchemas.length === 0 ? (
            <p className="text-muted-foreground">
              No schemas available. Please configure schemas in "Schema Config" first.
            </p>
          ) : (
            availableSchemas.map(schema => {
              const isAlreadyConfigured = configuredSchemas.includes(schema.id)
              const isSelected = selectedSchemas.includes(schema.id)
              
              return (
                <Card key={schema.id} className={isAlreadyConfigured ? 'opacity-50' : ''}>
                  <CardContent className="flex items-center p-3">
                    <Checkbox
                      id={`select-schema-${schema.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleSchemaToggle(schema.id)}
                      disabled={isAlreadyConfigured}
                    />
                    <div className="ml-3 flex-grow">
                      <Label
                        htmlFor={`select-schema-${schema.id}`}
                        className={`font-medium ${isAlreadyConfigured ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {schema.schemaName}
                        {isAlreadyConfigured && ' (Already added)'}
                      </Label>
                      <p className="text-sm text-muted-foreground">{schema.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fields: {schema.fields.map(f => f.name).join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedSchemas.length === 0}>
            Add Selected Schemas ({selectedSchemas.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
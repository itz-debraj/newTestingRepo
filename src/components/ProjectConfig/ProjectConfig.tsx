'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { 
  addSchemasToProject, 
  setSelectedSchemaId 
} from '@/store/slices/projectSlice'
import { addToast } from '@/store/slices/uiSlice'
import { Plus, Settings, FileText } from 'lucide-react'
import { SchemaSelectionModal } from './SchemaSelectionModal'
import { SchemaDataSection } from './SchemaDataSection'

export function ProjectConfig() {
  const schemas = useAppSelector(state => state.schemas.schemas)
  const { configuredSchemas, selectedSchemaId } = useAppSelector(state => state.projects)
  const dispatch = useAppDispatch()
  
  const [isAddSchemaModalOpen, setIsAddSchemaModalOpen] = useState(false)

  const configuredSchemaObjects = configuredSchemas
    .map(id => schemas.find(s => s.id === id))
    .filter(Boolean)

  const selectedSchema = schemas.find(s => s.id === selectedSchemaId)

  const handleAddSchemas = (schemaIds: string[]) => {
    dispatch(addSchemasToProject(schemaIds))
    dispatch(addToast({ message: 'Schemas added to project!', type: 'success' }))
    
    // Auto-select first schema if none selected
    if (!selectedSchemaId && schemaIds.length > 0) {
      dispatch(setSelectedSchemaId(schemaIds[0]))
    }
    
    setIsAddSchemaModalOpen(false)
  }

  return (
    <div className="p-2 md:p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-foreground">Project Metadata Configuration</h2>
        <Button onClick={() => setIsAddSchemaModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schemas
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Select and configure schemas for your specific project's metadata.
      </p>

      <div className="flex flex-grow space-x-6">
        {/* Left Side Panel for Configured Schemas */}
        <Card className="w-64 min-w-64 flex-shrink-0">
          <CardHeader>
            <CardTitle>Configured Schemas</CardTitle>
            <CardDescription>Schemas added to this project.</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            {configuredSchemaObjects.length === 0 ? (
              <p className="text-muted-foreground text-sm p-2 text-center">
                No schemas added yet. Click "Add Schemas" to begin.
              </p>
            ) : (
              <div className="space-y-1">
                {configuredSchemaObjects.map(schema => (
                  <Button
                    key={schema!.id}
                    variant={selectedSchemaId === schema!.id ? 'default' : 'ghost'}
                    onClick={() => dispatch(setSelectedSchemaId(schema!.id))}
                    className="w-full justify-start"
                  >
                    {schema!.schemaName}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area for Data Entry */}
        <Card className="flex-grow">
          <CardContent className="h-full p-0">
            {selectedSchema ? (
              <SchemaDataSection schema={selectedSchema} />
            ) : configuredSchemaObjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                <Settings className="h-20 w-20 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-2xl font-bold mb-2">No Schemas Added to this Project Yet!</h3>
                <p>Click "Add Schemas" to select and configure metadata structures for your project.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                <FileText className="h-20 w-20 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-2xl font-bold mb-2">Select a Schema to Configure its Data</h3>
                <p>Choose a schema from the left panel to start adding or editing its project-specific metadata.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SchemaSelectionModal
        isOpen={isAddSchemaModalOpen}
        onClose={() => setIsAddSchemaModalOpen(false)}
        onConfirm={handleAddSchemas}
        availableSchemas={schemas}
        configuredSchemas={configuredSchemas}
      />
    </div>
  )
}
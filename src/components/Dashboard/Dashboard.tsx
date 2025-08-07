'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppSelector } from '@/hooks/useAppSelector'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const mockEntityData = [
  { id: 'e1', entityId: 'PROJ-001', entityName: 'Project Falcon', status: 'Submitted', value: 150000, ownerName: 'Acme Corp', startDate: '2024-06-15', endDate: '2024-07-15' },
  { id: 'e2', entityId: 'PROJ-002', entityName: 'Office Renovation', status: 'Completed', value: 250000, ownerName: 'Globex Inc', startDate: '2024-05-20', endDate: '2024-06-20' },
  { id: 'e3', entityId: 'PROJ-003', entityName: 'Software Licensing', status: 'Draft', value: 80000, ownerName: 'Soylent Corp', startDate: '2024-04-01', endDate: '2024-05-01' },
  { id: 'e4', entityId: 'PROJ-004', entityName: 'Cloud Migration', status: 'Submitted', value: 300000, ownerName: 'Cyberdyne Systems', startDate: '2024-03-01', endDate: '2024-03-30' },
  {id:'e5',entityId:'PROJ-005',entityName:'AI Research Lab Setup',status:'Submitted',value:450000,ownerName:'Wayne Enterprises',startDate:'2024-07-01',endDate:'2024-08-01'},
  {id:'e6',entityId:'PROJ-006',entityName:'Data Center Expansion',status:'Completed',value:520000,ownerName:'Stark Industries',startDate:'2024-02-15',endDate:'2024-04-15'},
  {id:'e7',entityId:'PROJ-007',entityName:'Marketing Automation Tool',status:'Draft',value:120000,ownerName:'Oscorp',startDate:'2024-08-01',endDate:'2024-09-01'},
  {id:'e8',entityId:'PROJ-008',entityName:'Global HR Integration',status:'Submitted',value:310000,ownerName:'LexCorp',startDate:'2024-06-10',endDate:'2024-07-20'},
  {id:'e9',entityId:'PROJ-009',entityName:'Fleet Management System',status:'Lost',value:190000,ownerName:'InGen Technologies',startDate:'2024-01-10',endDate:'2024-02-15'},
  {id:'e10',entityId:'PROJ-010',entityName:'Warehouse Automation',status:'Completed',value:275000,ownerName:'Umbrella Corp',startDate:'2024-03-05',endDate:'2024-04-10'},
  {id:'e11',entityId:'PROJ-011',entityName:'Digital Learning Platform',status:'Draft',value:95000,ownerName:'Blue Sun Corp',startDate:'2024-08-05',endDate:'2024-09-05'},
  {id:'e12',entityId:'PROJ-012',entityName:'Customer Analytics Revamp',status:'Submitted',value:160000,ownerName:'Hooli',startDate:'2024-05-01',endDate:'2024-06-01'},
  {id:'e13',entityId:'PROJ-013',entityName:'Retail POS Upgrade',status:'Completed',value:210000,ownerName:'Tyrell Corporation',startDate:'2024-02-01',endDate:'2024-03-15'},
  {id:'e14',entityId:'PROJ-014',entityName:'Cybersecurity Overhaul',status:'Lost',value:480000,ownerName:'Black Mesa',startDate:'2024-06-01',endDate:'2024-07-10'}

]

const chartColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--foreground))']

export function Dashboard() {
  const schemas = useAppSelector(state => state.schemas.schemas)
  const projectData = useAppSelector(state => state.projects.projectData)

  // Calculate total data entries across all schemas
  const totalDataEntries = Object.values(projectData).reduce((total, schemaData) => total + schemaData.length, 0)

  // Process entity data for status bar chart
  const statusCounts = mockEntityData.reduce((acc, entity) => {
    acc[entity.status] = (acc[entity.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const entityStatusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status],
  }))

  // Process schemas for pie chart
  const schemaCounts = schemas.reduce((acc, schema) => {
    acc[schema.schemaName] = (acc[schema.schemaName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const metadataSchemaChartData = Object.keys(schemaCounts).map(schemaName => ({
    name: schemaName,
    value: schemaCounts[schemaName],
  }))

  const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

  return (
    <div className="p-2 md:p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Total Metadata Schemas</CardTitle>
            <CardDescription>Defined schemas for data.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{schemas.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Data Entries</CardTitle>
            <CardDescription>All data records in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalDataEntries + mockEntityData.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Entries</CardTitle>
            <CardDescription>Entries currently active or in draft.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockEntityData.filter(entry => entry.status === 'Draft' || entry.status === 'Submitted').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Entries (YTD)</CardTitle>
            <CardDescription>Entries that were completed this year.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockEntityData.filter(entry => entry.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* <Card>
          <CardHeader>
            <CardTitle>Entry Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={entityStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}


        
    <Card>
      <CardHeader>
        <CardTitle>Entry Status Distribution</CardTitle>
       
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={entityStatusData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
             {/* <YAxis
             dataKey={'count'}
               tickLine={false}
                tickMargin={10}
              axisLine={false}
            /> */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={8} />
            <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
          </BarChart>
        </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
     
    </Card>
    

        <Card>
          <CardHeader>
            <CardTitle>Metadata Schemas Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={metadataSchemaChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  label
                >
                  {metadataSchemaChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schemas Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recently Updated Metadata Schemas</h3>
        {schemas.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schema Name</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemas.slice(0, 5).map((schema) => (
                    <TableRow key={schema.id}>
                      <TableCell className="font-medium">{schema.schemaName}</TableCell>
                      <TableCell>{schema.fields.map(f => f.name).join(', ')}</TableCell>
                      <TableCell>{schema.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No metadata configurations defined yet. Go to "Schema Config" to add some!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Data Submissions */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recent Data Submissions</h3>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry ID</TableHead>
                  <TableHead>Entry Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEntityData.slice(0, 5).map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell className="font-medium">{entity.entityId}</TableCell>
                    <TableCell>{entity.entityName}</TableCell>
                    <TableCell>{entity.status}</TableCell>
                    <TableCell>${entity.value?.toLocaleString()}</TableCell>
                    <TableCell>{entity.ownerName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
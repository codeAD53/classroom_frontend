import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { ListView } from '@/components/refine-ui/views/list-view'
import { useDeferredValue, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { DEPARTMENT_OPTIONS } from '@/constants'
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { useTable } from '@refinedev/react-table'
import { Subject } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const defferedSearchQuery = useDeferredValue(searchQuery);
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const departmentFilters = useMemo(()=>
        selectedDepartment === 'all' ? [] : [
            {field: 'department',operator: 'eq' as const, value: selectedDepartment}    
        ],[selectedDepartment])

    const searchFilters = useMemo(()=>
        defferedSearchQuery ? [
            {field: 'name', operator: 'contains' as const, value: defferedSearchQuery} //The search filter triggers on every keystroke. For server-side filtering, this could cause excessive API calls. Consider debouncing the search query.
        ] : [],[defferedSearchQuery])

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(()=>[ 
            // Filter arrays should be memoized to prevent unnecessary refetches.
            // departmentFilters and searchFilters are recreated on every render. Since they're passed to refineCoreProps.filters.permanent, this could trigger unnecessary data refetches when the component re-renders for unrelated reasons.
            {
                 id: 'code', 
                accessorKey: 'code',
                size: 100,
                header: () => <p className='column-title ml-2'>Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className='column-title'>Name</p>,
                cell: ({getValue}) => <span
                className='text-foreground'>{getValue<string>()}</span>,
                
            },
            {
                id: 'department',
                accessorKey: 'department',
                size: 150,
                header: () => <p className='column-title'>Department</p>,
                cell: ({getValue}) => <Badge variant="secondary">{getValue<string>()}</Badge>
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className='column-title'>Description</p>,
                cell: ({getValue}) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>
            }
        ],[]),
        refineCoreProps:{
            resource: 'subjects',
            pagination: {pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...departmentFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    {
                        field: 'id', order: 'desc'
                    }
                ]
            },
        }
    });
  return (
    <ListView>
        <Breadcrumb />
        <h1 className='page-title'>Subjects</h1>

        <div className="intro-row">
            <p>Quick access to essential metrics and management tools.</p>
            <div className="actions-row">
                <div className="search-field">
                    <Search className='search-icon' />
                    <Input 
                        type="text"
                        placeholder="Search by name..."
                        className='pl-10 w-full'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                            <SelectItem value="all">
                                                    All Departments
                                            </SelectItem>
                                            {DEPARTMENT_OPTIONS.map(department => (
                                                <SelectItem key={department.value} value={department.value}>
                                                    {department.label}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                            </Select>

                            <CreateButton />
                        </div>

                </div>
            </div>

            <DataTable table={subjectTable} />
    </ListView>
  )
}

export default SubjectsList

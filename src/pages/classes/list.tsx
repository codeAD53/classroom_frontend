import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListView } from '@/components/refine-ui/views/list-view';
import { useDeferredValue, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { useTable } from '@refinedev/react-table';
import { useList } from '@refinedev/core';
import { ClassDetails, Subject, User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ShowButton } from '@/components/refine-ui/buttons/show';

type ClassListRecord = ClassDetails & {
  subject?: { name?: string; id?: number } | null;
  teacher?: { name?: string; id?: string } | null;
};

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');

  const { data: subjectsData } = useList<Subject>({
    resource: 'subjects',
    pagination: { pageSize: 100 },
  });
  const { data: teachersData } = useList<User>({
    resource: 'users',
    filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
    pagination: { pageSize: 100 },
  });

  const subjects = subjectsData?.data ?? [];
  const teachers = teachersData?.data ?? [];

  const subjectFilters = useMemo(
    () =>
      selectedSubject === 'all'
        ? []
        : [{ field: 'subject', operator: 'eq' as const, value: selectedSubject }],
    [selectedSubject]
  );

  const teacherFilters = useMemo(
    () =>
      selectedTeacher === 'all'
        ? []
        : [{ field: 'teacher', operator: 'eq' as const, value: selectedTeacher }],
    [selectedTeacher]
  );

  const searchFilters = useMemo(
    () =>
      deferredSearchQuery
        ? [
            {
              field: 'name',
              operator: 'contains' as const,
              value: deferredSearchQuery,
            },
          ]
        : [],
    [deferredSearchQuery]
  );

  const classTable = useTable<ClassListRecord>({
    columns: useMemo<ColumnDef<ClassListRecord>[]>(
      () => [
        {
          id: 'bannerUrl',
          accessorKey: 'bannerUrl',
          size: 80,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => {
            const url = getValue<string>();
            return url ? (
              <img
                src={url}
                alt=""
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-muted" />
            );
          },
        },
        {
          id: 'name',
          accessorKey: 'name',
          size: 200,
          header: () => <p className="column-title">Class Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: 'status',
          accessorKey: 'status',
          size: 100,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => {
            const status = getValue<string>();
            return (
              <Badge
                variant={
                  status === 'active'
                    ? 'default'
                    : status === 'inactive'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {status ?? '—'}
              </Badge>
            );
          },
        },
        {
          id: 'subject',
          accessorFn: (row) => row.subject?.name ?? '—',
          size: 150,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ row }) => (
            <span className="text-foreground">
              {row.original.subject?.name ?? '—'}
            </span>
          ),
        },
        {
          id: 'teacher',
          accessorFn: (row) => row.teacher?.name ?? '—',
          size: 150,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ row }) => (
            <span className="text-foreground">
              {row.original.teacher?.name ?? '—'}
            </span>
          ),
        },
        {
          id: 'capacity',
          accessorKey: 'capacity',
          size: 100,
          header: () => <p className="column-title">Capacity</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<number>() ?? '—'}</span>
          ),
        },
        {
          id: 'details',
          size: 140,
          header: () => <p className="column-title">Details</p>,
          cell: ({row}) => <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">View Details</ShowButton>
          
        }
      ],
      []
    ),
    refineCoreProps: {
      resource: 'classes',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
      },
      sorters: {
        initial: [{ field: 'createdAt', order: 'desc' }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by class name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.name}
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem
                    key={teacher.id}
                    value={teacher.name ?? ''}
                  >
                    {teacher.name ?? teacher.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
};

export default ClassesList;

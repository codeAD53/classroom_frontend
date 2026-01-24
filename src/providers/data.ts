import {BaseRecord, DataProvider,GetListParams,GetListResponse} from '@refinedev/core'

const mockSubjects = [
    {
        id: 1,
        code: 'CS101',
        name: 'Introduction to Computer Science',
        department: 'CS',
        description: 'Basic concepts of programming and computer science.'
    },
    {
        id: 2,
        code: 'MATH201',
        name: 'Calculus I',
        department: 'Math',
        description: 'Fundamental principles of differential and integral calculus.'
    },
    {
        id: 3,
        code: 'ENG101',
        name: 'English Composition',
        department: 'English',
        description: 'Development of writing skills and critical thinking through composition.'
    }
]

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({resource}: GetListParams): Promise<GetListResponse<TData>> =>{
          if(resource === 'subjects'){
            return {
              data: mockSubjects as unknown as TData[],
              total: mockSubjects.length,
            }
          } else {
            return { data: [] as TData[], total: 0};
          }
  },
  getOne: async () => {throw new Error('This function is not present in mock')},
  create: async () => {throw new Error('This function is not present in mock')},
  update: async () => {throw new Error('This function is not present in mock')},
  deleteOne: async () => {throw new Error('This function is not present in mock')},

  getApiUrl: () => '',
}
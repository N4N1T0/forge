/*
  Appwrite Tables setup script
  - Creates database (if missing)
  - Creates tables and columns for Workspaces, Members, Projects, Tasks, TaskComments

  Usage:
  - Add the variables to the script on the VARIABLES section
  - Run: pnpm tsx src/scripts/create-tables.ts
*/

import { Role, Status } from '@/types/appwrite'
import { Client, IndexType, TablesDB } from 'node-appwrite'

// VARIABLES (Replace with your own values) || Delete after use
const APPWRITE_API_KEY = ''
const APPWRITE_ENDPOINT = ''
const APPWRITE_PROJECT_ID = ''
const DATABASE_ID = ''
const MEMBERS_COLLECTION_ID = ''
const PROJECTS_COLLECTION_ID = ''
const TASKS_COLLECTION_ID = ''
const TASK_COMMENTS_COLLECTION_ID = ''
const WORKSPACES_COLLECTION_ID = ''

type ColumnIndex = {
  key: string
  type: IndexType
  columns: string[]
  orders?: string[]
  lengths?: number[]
}

// CREATE ADMIN CLIENT
function createAdminTablesClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY)
  return new TablesDB(client)
}

// ENSURE DATABASE EXISTS
async function ensureDatabase(
  tables: TablesDB,
  databaseId: string,
  name = 'Forge',
  enabled = true
) {
  try {
    await tables.get({ databaseId })
    console.log(`Database '${databaseId}' exists.`)
  } catch (_err) {
    console.log(`Creating database '${databaseId}' ...`)
    await tables.create({ databaseId, name, enabled })
    console.log(`Database '${databaseId}' created.`)
  }
}

// ENSURE TABLE EXISTS
async function ensureTable(
  tables: TablesDB,
  databaseId: string,
  tableId: string,
  name: string,
  permissions: string[] = [
    'read("users")',
    'create("users")',
    'update("users")',
    'delete("users")'
  ],
  rowSecurity = true,
  enabled = true
) {
  try {
    await tables.getTable({ databaseId, tableId })
    console.log(`Table '${name}' (${tableId}) exists.`)
  } catch (_err) {
    console.log(`Creating table '${name}' (${tableId}) ...`)
    await tables.createTable({
      databaseId,
      tableId,
      name,
      permissions,
      rowSecurity,
      enabled
    })
    console.log(`Table '${name}' (${tableId}) created.`)
  }
}

// LIST COLUMN KEYS
async function listColumnKeys(
  tables: TablesDB,
  databaseId: string,
  tableId: string
): Promise<Set<string>> {
  const list = await tables.listColumns({ databaseId, tableId })
  return new Set(list.columns.map((c) => c.key))
}

// LIST INDEX KEYS
async function listIndexKeys(
  tables: TablesDB,
  databaseId: string,
  tableId: string
): Promise<Set<string>> {
  const list = await tables.listIndexes({ databaseId, tableId })
  return new Set(list.indexes.map((i) => i.key))
}

// ENSURE STRING COLUMN
async function ensureString(
  tables: TablesDB,
  databaseId: string,
  tableId: string,
  key: string,
  size: number,
  required: boolean,
  opts?: { array?: boolean; encrypt?: boolean; xdefault?: string }
) {
  const keys = await listColumnKeys(tables, databaseId, tableId)
  if (!keys.has(key)) {
    await tables.createStringColumn({
      databaseId,
      tableId,
      key,
      size,
      required,
      array: opts?.array,
      encrypt: opts?.encrypt,
      xdefault: opts?.xdefault
    })
    console.log(
      `  + column '${key}' (string, size=${size}, required=${required})`
    )
  }
}

// ENSURE ENUM COLUMN
async function ensureEnum(
  tables: TablesDB,
  databaseId: string,
  tableId: string,
  key: string,
  elements: string[],
  required: boolean,
  opts?: { array?: boolean; xdefault?: string }
) {
  const keys = await listColumnKeys(tables, databaseId, tableId)
  if (!keys.has(key)) {
    await tables.createEnumColumn({
      databaseId,
      tableId,
      key,
      elements,
      required,
      array: opts?.array,
      xdefault: opts?.xdefault
    })
    console.log(
      `  + column '${key}' (enum: [${elements.join(', ')}], required=${required})`
    )
  }
}

// ENSURE INTEGER COLUMN
async function ensureInteger(
  tables: TablesDB,
  databaseId: string,
  tableId: string,
  key: string,
  required: boolean,
  opts?: { min?: number; max?: number; xdefault?: number; array?: boolean }
) {
  const keys = await listColumnKeys(tables, databaseId, tableId)
  if (!keys.has(key)) {
    await tables.createIntegerColumn({
      databaseId,
      tableId,
      key,
      required,
      min: opts?.min,
      max: opts?.max,
      xdefault: opts?.xdefault,
      array: opts?.array
    })
    console.log(`  + column '${key}' (integer, required=${required})`)
  }
}

// ENSURE DATETIME COLUMN
async function ensureDatetime(
  tables: TablesDB,
  databaseId: string,
  tableId: string,
  key: string,
  required: boolean,
  opts?: { xdefault?: string; array?: boolean }
) {
  const keys = await listColumnKeys(tables, databaseId, tableId)
  if (!keys.has(key)) {
    await tables.createDatetimeColumn({
      databaseId,
      tableId,
      key,
      required,
      xdefault: opts?.xdefault,
      array: opts?.array
    })
    console.log(`  + column '${key}' (datetime, required=${required})`)
  }
}

// ENSURE INDEX
async function ensureIndex(
  tables: TablesDB,
  databaseId: string,
  tableId: string,
  index: ColumnIndex
) {
  const keys = await listIndexKeys(tables, databaseId, tableId)
  if (!keys.has(index.key)) {
    await tables.createIndex({
      databaseId,
      tableId,
      key: index.key,
      type: index.type,
      columns: index.columns,
      orders: index.orders,
      lengths: index.lengths
    })
    console.log(
      `  + index '${index.key}' (${index.type}) on [${index.columns.join(', ')}]`
    )
  }
}

// SETUP WORKSPACES
async function setupWorkspaces(tables: TablesDB) {
  await ensureTable(tables, DATABASE_ID, WORKSPACES_COLLECTION_ID, 'workspaces')
  // COLUMNS
  await ensureString(
    tables,
    DATABASE_ID,
    WORKSPACES_COLLECTION_ID,
    'userId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    WORKSPACES_COLLECTION_ID,
    'icon',
    64,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    WORKSPACES_COLLECTION_ID,
    'slug',
    64,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    WORKSPACES_COLLECTION_ID,
    'description',
    2048,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    WORKSPACES_COLLECTION_ID,
    'name',
    128,
    false
  )
  // INDEXES
  await ensureIndex(tables, DATABASE_ID, WORKSPACES_COLLECTION_ID, {
    key: 'idx_workspaces_userId',
    type: IndexType.Key,
    columns: ['userId']
  })
  await ensureIndex(tables, DATABASE_ID, WORKSPACES_COLLECTION_ID, {
    key: 'uniq_workspaces_slug',
    type: IndexType.Unique,
    columns: ['slug']
  })
}

// SETUP MEMBERS
async function setupMembers(tables: TablesDB) {
  await ensureTable(tables, DATABASE_ID, MEMBERS_COLLECTION_ID, 'members')
  // COLUMNS
  await ensureString(
    tables,
    DATABASE_ID,
    MEMBERS_COLLECTION_ID,
    'userId',
    36,
    false
  )
  await ensureString(
    tables,
    DATABASE_ID,
    MEMBERS_COLLECTION_ID,
    'workspaceId',
    36,
    false
  )
  await ensureEnum(
    tables,
    DATABASE_ID,
    MEMBERS_COLLECTION_ID,
    'role',
    Object.values(Role),
    true
  )
  // INDEXES
  await ensureIndex(tables, DATABASE_ID, MEMBERS_COLLECTION_ID, {
    key: 'idx_members_userId',
    type: IndexType.Key,
    columns: ['userId']
  })
  await ensureIndex(tables, DATABASE_ID, MEMBERS_COLLECTION_ID, {
    key: 'idx_members_workspaceId',
    type: IndexType.Key,
    columns: ['workspaceId']
  })
  await ensureIndex(tables, DATABASE_ID, MEMBERS_COLLECTION_ID, {
    key: 'uniq_members_user_workspace',
    type: IndexType.Unique,
    columns: ['userId', 'workspaceId']
  })
}

// SETUP PROJECTS
async function setupProjects(tables: TablesDB) {
  await ensureTable(tables, DATABASE_ID, PROJECTS_COLLECTION_ID, 'projects')
  // COLUMNS
  await ensureString(
    tables,
    DATABASE_ID,
    PROJECTS_COLLECTION_ID,
    'workspaceId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    PROJECTS_COLLECTION_ID,
    'name',
    128,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    PROJECTS_COLLECTION_ID,
    'shortcut',
    16,
    false
  )
  // INDEXES
  await ensureIndex(tables, DATABASE_ID, PROJECTS_COLLECTION_ID, {
    key: 'idx_projects_workspaceId',
    type: IndexType.Key,
    columns: ['workspaceId']
  })
  await ensureIndex(tables, DATABASE_ID, PROJECTS_COLLECTION_ID, {
    key: 'uniq_projects_workspace_shortcut',
    type: IndexType.Unique,
    columns: ['workspaceId', 'shortcut']
  })
}

// SETUP TASKS
async function setupTasks(tables: TablesDB) {
  await ensureTable(tables, DATABASE_ID, TASKS_COLLECTION_ID, 'tasks')
  // COLUMNS
  await ensureString(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'workspaceId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'name',
    256,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'projectId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'assigneeId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'description',
    5000,
    false
  )
  await ensureDatetime(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'dueDate',
    true
  )
  await ensureEnum(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'status',
    Object.values(Status),
    true
  )
  await ensureInteger(
    tables,
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    'position',
    true
  )
  // INDEXES
  await ensureIndex(tables, DATABASE_ID, TASKS_COLLECTION_ID, {
    key: 'idx_tasks_workspaceId',
    type: IndexType.Key,
    columns: ['workspaceId']
  })
  await ensureIndex(tables, DATABASE_ID, TASKS_COLLECTION_ID, {
    key: 'idx_tasks_projectId',
    type: IndexType.Key,
    columns: ['projectId']
  })
  await ensureIndex(tables, DATABASE_ID, TASKS_COLLECTION_ID, {
    key: 'idx_tasks_assigneeId',
    type: IndexType.Key,
    columns: ['assigneeId']
  })
}

// SETUP TASK COMMENTS
async function setupTaskComments(tables: TablesDB) {
  await ensureTable(
    tables,
    DATABASE_ID,
    TASK_COMMENTS_COLLECTION_ID,
    'task_comments'
  )
  // COLUMNS
  await ensureString(
    tables,
    DATABASE_ID,
    TASK_COMMENTS_COLLECTION_ID,
    'taskId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    TASK_COMMENTS_COLLECTION_ID,
    'authorId',
    36,
    true
  )
  await ensureString(
    tables,
    DATABASE_ID,
    TASK_COMMENTS_COLLECTION_ID,
    'content',
    5000,
    true
  )
  // INDEXES
  await ensureIndex(tables, DATABASE_ID, TASK_COMMENTS_COLLECTION_ID, {
    key: 'idx_task_comments_taskId',
    type: IndexType.Key,
    columns: ['taskId']
  })
  await ensureIndex(tables, DATABASE_ID, TASK_COMMENTS_COLLECTION_ID, {
    key: 'idx_task_comments_authorId',
    type: IndexType.Key,
    columns: ['authorId']
  })
}

// MAIN
async function main() {
  if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    throw new Error('Missing Appwrite configuration env vars.')
  }

  if (!DATABASE_ID) {
    throw new Error('Missing `NEXT_PUBLIC_APPWRITE_DATABASE_ID` env var.')
  }

  const tables = createAdminTablesClient()

  console.log('Ensuring database exists...')
  await ensureDatabase(tables, DATABASE_ID, 'Forge', true)

  console.log('Creating/ensuring tables and columns...')
  console.log('- Workspaces')
  await setupWorkspaces(tables)
  console.log('- Members')
  await setupMembers(tables)
  console.log('- Projects')
  await setupProjects(tables)
  console.log('- Tasks')
  await setupTasks(tables)
  console.log('- Task Comments')
  await setupTaskComments(tables)

  console.log('All done!')
}

main().catch((err) => {
  console.error('Setup failed:', err)
  process.exit(1)
})

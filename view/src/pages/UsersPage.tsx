
import { useQuery } from '@tanstack/react-query'
import {
  Panel,
  Table,
  Loader,
  Message,
  Tag,
} from 'rsuite'
import { usersApi, type User } from '../api/api'

const { Column, HeaderCell, Cell } = Table

export default function UsersPage() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  })

  if (isLoading) return <Loader center content="Loading..." />
  if (isError) return <Message type="error">Failed to load users</Message>

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ color: '#fff', margin: 0 }}>Connected Users</h4>
      </div>

      <Panel style={{ background: '#1a1d24' }}>
        <Table autoHeight data={data}>
          <Column width={60}>
            <HeaderCell>UID</HeaderCell>
            <Cell dataKey="user_id" />
          </Column>
          <Column flexGrow={1} minWidth={160}>
            <HeaderCell>ID</HeaderCell>
            <Cell>
              {(row: User) => (
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#aaa' }}>
                  {row.id}
                </span>
              )}
            </Cell>
          </Column>
          <Column flexGrow={1} minWidth={160}>
            <HeaderCell>Domain ID</HeaderCell>
            <Cell>
              {(row: User) => (
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#aaa' }}>
                  {row.domain_id}
                </span>
              )}
            </Cell>
          </Column>
          <Column width={160}>
            <HeaderCell>Created</HeaderCell>
            <Cell dataKey="created_at" />
          </Column>
          <Column width={160}>
            <HeaderCell>Last Login</HeaderCell>
            <Cell>
              {(row: User) =>
                row.last_login ? (
                  <Tag color="green">{row.last_login}</Tag>
                ) : (
                  <Tag>never</Tag>
                )
              }
            </Cell>
          </Column>
        </Table>
      </Panel>
    </div>
  )
}

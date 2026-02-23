import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Panel,
  Table,
  Button,
  Modal,
  Form,
  Toggle,
  Tag,
  IconButton,
  Loader,
  Message,
  toaster,
  SelectPicker,
} from 'rsuite'
import { Plus as PlusIcon, Pencil as EditIcon, Trash2 as TrashIcon } from 'lucide-react'
import { domainsApi, type Domain, type CreateDomainInput } from '../api/api'

const { Column, HeaderCell, Cell } = Table

const authOptions = [
  { label: 'None', value: '' },
  { label: 'Basic', value: 'basic' },
  { label: 'JWT / Bearer', value: 'jwt' },
  { label: 'API Key', value: 'key' },
]

const emptyForm: CreateDomainInput = {
  domain_name: '',
  domain_source: '',
  domain_target: '',
  auth_type: null,
  auth_header: null,
  auth_token: null,
  active: true,
}

export default function DomainsPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Domain>>(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['domains'],
    queryFn: domainsApi.list,
  })

  const saveMut = useMutation({
    mutationFn: (d: Partial<Domain> & { domain_id?: string }) =>
      d.domain_id ? domainsApi.update(d.domain_id, d) : domainsApi.create(d as CreateDomainInput),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['domains'] })
      setOpen(false)
      toaster.push(<Message type="success">Saved</Message>)
    },
    onError: () => toaster.push(<Message type="error">Save failed</Message>),
  })

  const delMut = useMutation({
    mutationFn: domainsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['domains'] }),
  })

  function openAdd() {
    setForm(emptyForm)
    setEditId(null)
    setOpen(true)
  }

  function openEdit(row: Domain) {
    setForm(row)
    setEditId(row.domain_id)
    setOpen(true)
  }

  function handleSubmit() {
    saveMut.mutate(editId ? { ...form, domain_id: editId } : form)
  }

  if (isLoading) return <Loader center content="Loading..." />
  if (isError) return <Message type="error">Failed to load domains</Message>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ color: '#fff', margin: 0 }}>Domains</h4>
        <Button appearance="primary" startIcon={<PlusIcon />} onClick={openAdd}>
          Add Domain
        </Button>
      </div>

      <Panel style={{ background: '#1a1d24' }}>
        <Table autoHeight data={data} wordWrap="break-word">
          <Column flexGrow={1} minWidth={140}>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="domain_name" />
          </Column>
          <Column flexGrow={1} minWidth={160}>
            <HeaderCell>Target</HeaderCell>
            <Cell dataKey="domain_target" />
          </Column>
          <Column width={90}>
            <HeaderCell>Auth</HeaderCell>
            <Cell>
              {(row: Domain) =>
                row.auth_type ? <Tag color="cyan">{row.auth_type}</Tag> : <Tag>none</Tag>
              }
            </Cell>
          </Column>
          <Column width={80}>
            <HeaderCell>Active</HeaderCell>
            <Cell>
              {(row: Domain) => (
                <Tag color={row.active ? 'green' : 'red'}>
                  {row.active ? 'Yes' : 'No'}
                </Tag>
              )}
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(row: Domain) => (
                <span style={{ display: 'flex', gap: 6 }}>
                  <IconButton icon={<EditIcon />} size="xs" onClick={() => openEdit(row)} />
                  <IconButton
                    icon={<TrashIcon />}
                    size="xs"
                    color="red"
                    appearance="subtle"
                    onClick={() => delMut.mutate(row.domain_id)}
                  />
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      </Panel>

      <Modal open={open} onClose={() => setOpen(false)} size="sm">
        <Modal.Header>
          <Modal.Title>{editId ? 'Edit Domain' : 'Add Domain'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Domain Name</Form.ControlLabel>
              <Form.Control
                name="domain_name"
                value={form.domain_name ?? ''}
                onChange={(v: string) => setForm((f) => ({ ...f, domain_name: v }))}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Target URL</Form.ControlLabel>
              <Form.Control
                name="domain_target"
                value={form.domain_target ?? ''}
                onChange={(v: string) => setForm((f) => ({ ...f, domain_target: v }))}
                placeholder="http://127.0.0.1:5000"
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Auth Type</Form.ControlLabel>
              <SelectPicker
                data={authOptions}
                value={form.auth_type ?? ''}
                onChange={(v) => setForm((f) => ({ ...f, auth_type: v || null }))}
                block
              />
            </Form.Group>
            {form.auth_type === 'key' && (
              <Form.Group>
                <Form.ControlLabel>Auth Header</Form.ControlLabel>
                <Form.Control
                  name="auth_header"
                  value={form.auth_header ?? ''}
                  onChange={(v: string) => setForm((f) => ({ ...f, auth_header: v }))}
                  placeholder="X-API-Key"
                />
              </Form.Group>
            )}
            {form.auth_type && (
              <Form.Group>
                <Form.ControlLabel>Auth Token</Form.ControlLabel>
                <Form.Control
                  name="auth_token"
                  value={form.auth_token ?? ''}
                  onChange={(v: string) => setForm((f) => ({ ...f, auth_token: v }))}
                />
              </Form.Group>
            )}
            <Form.Group>
              <Form.ControlLabel>Active</Form.ControlLabel>
              <Toggle
                checked={form.active ?? true}
                onChange={(v) => setForm((f) => ({ ...f, active: v }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary" loading={saveMut.isPending}>
            Save
          </Button>
          <Button onClick={() => setOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

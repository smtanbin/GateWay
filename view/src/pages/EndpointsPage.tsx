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
import { endpointsApi, domainsApi, type Endpoint, type CreateEndpointInput } from '../api/api'

const { Column, HeaderCell, Cell } = Table

const methodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => ({
  label: m,
  value: m,
}))

const emptyForm: CreateEndpointInput = {
  request_type: 'GET',
  endpoint: '',
  domain_name: '',
  active: true,
}

export default function EndpointsPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Endpoint>>(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)

  const { data = [], isLoading } = useQuery({ queryKey: ['endpoints'], queryFn: endpointsApi.list })
  const { data: domains = [] } = useQuery({ queryKey: ['domains'], queryFn: domainsApi.list })
  const domainOptions = domains.map((d) => ({ label: d.domain_name, value: d.domain_name }))

  const saveMut = useMutation({
    mutationFn: (d: Partial<Endpoint> & { id?: string }) =>
      d.id ? endpointsApi.update(d.id, d) : endpointsApi.create(d as CreateEndpointInput),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['endpoints'] })
      setOpen(false)
      toaster.push(<Message type="success">Saved</Message>)
    },
    onError: () => toaster.push(<Message type="error">Save failed</Message>),
  })

  const delMut = useMutation({
    mutationFn: endpointsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['endpoints'] }),
  })

  function openAdd() { setForm(emptyForm); setEditId(null); setOpen(true) }
  function openEdit(row: Endpoint) { setForm(row); setEditId(row.id); setOpen(true) }
  function handleSubmit() { saveMut.mutate(editId ? { ...form, id: editId } : form) }

  if (isLoading) return <Loader center content="Loading..." />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ color: '#fff', margin: 0 }}>Endpoints</h4>
        <Button appearance="primary" startIcon={<PlusIcon />} onClick={openAdd}>
          Add Endpoint
        </Button>
      </div>

      <Panel style={{ background: '#1a1d24' }}>
        <Table autoHeight data={data}>
          <Column flexGrow={1} minWidth={130}>
            <HeaderCell>Domain</HeaderCell>
            <Cell dataKey="domain_name" />
          </Column>
          <Column width={90}>
            <HeaderCell>Method</HeaderCell>
            <Cell>
              {(row: Endpoint) => (
                <Tag color="blue">{row.request_type}</Tag>
              )}
            </Cell>
          </Column>
          <Column flexGrow={1} minWidth={130}>
            <HeaderCell>Endpoint</HeaderCell>
            <Cell dataKey="endpoint" />
          </Column>
          <Column width={80}>
            <HeaderCell>Active</HeaderCell>
            <Cell>
              {(row: Endpoint) => (
                <Tag color={row.active ? 'green' : 'red'}>
                  {row.active ? 'Yes' : 'No'}
                </Tag>
              )}
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(row: Endpoint) => (
                <span style={{ display: 'flex', gap: 6 }}>
                  <IconButton icon={<EditIcon />} size="xs" onClick={() => openEdit(row)} />
                  <IconButton
                    icon={<TrashIcon />}
                    size="xs"
                    color="red"
                    appearance="subtle"
                    onClick={() => delMut.mutate(row.id)}
                  />
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      </Panel>

      <Modal open={open} onClose={() => setOpen(false)} size="sm">
        <Modal.Header>
          <Modal.Title>{editId ? 'Edit Endpoint' : 'Add Endpoint'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Domain</Form.ControlLabel>
              <SelectPicker
                data={domainOptions}
                value={form.domain_name ?? ''}
                onChange={(v) => setForm((f) => ({ ...f, domain_name: v ?? '' }))}
                block
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>HTTP Method</Form.ControlLabel>
              <SelectPicker
                data={methodOptions}
                value={form.request_type ?? 'GET'}
                onChange={(v) => setForm((f) => ({ ...f, request_type: v ?? 'GET' }))}
                block
                cleanable={false}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Path</Form.ControlLabel>
              <Form.Control
                name="endpoint"
                value={form.endpoint ?? ''}
                onChange={(v: string) => setForm((f) => ({ ...f, endpoint: v }))}
                placeholder="/resource or *"
              />
            </Form.Group>
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
          <Button onClick={handleSubmit} appearance="primary" loading={saveMut.isPending}>Save</Button>
          <Button onClick={() => setOpen(false)} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

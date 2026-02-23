import type { ReactNode } from 'react'
import { Panel, Grid, Row, Col, FlexboxGrid, Progress, Loader, Tag } from 'rsuite'
import { useQuery } from '@tanstack/react-query'
import { Globe, GitBranch, Users, Server, Activity, Cpu, Clock } from 'lucide-react'
import { statsApi, type ServerStats } from '../api/api'

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
  loading?: boolean
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  return (
    <Panel style={{ background: '#1a1d24', borderRadius: 8, border: `1px solid ${color}33` }}>
      <FlexboxGrid justify="space-between" align="middle">
        <FlexboxGrid.Item>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff' }}>
            {loading ? <Loader size="sm" /> : value}
          </div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `${color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color,
          }}>
            {icon}
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Panel>
  )
}

// ─── Meter Row ────────────────────────────────────────────────────────────────

function MeterRow({ label, value, max, unit, color }: {
  label: string; value: number; max: number; unit: string; color: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ marginBottom: 14 }}>
      <FlexboxGrid justify="space-between" style={{ marginBottom: 4 }}>
        <FlexboxGrid.Item style={{ color: '#ccc', fontSize: 13 }}>{label}</FlexboxGrid.Item>
        <FlexboxGrid.Item style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
          {value.toFixed(value < 10 ? 2 : 0)} {unit}
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Progress.Line percent={pct} strokeColor={color} showInfo={false} strokeWidth={6} />
    </div>
  )
}

// ─── Uptime Formatter ─────────────────────────────────────────────────────────

function formatUptime(secs: number): string {
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

// ─── Server Monitor ───────────────────────────────────────────────────────────

function ServerMonitor() {
  const { data, isLoading, isError } = useQuery<ServerStats>({
    queryKey: ['stats'],
    queryFn: statsApi.get,
    refetchInterval: 2000,
    staleTime: 0,
  })

  return (
    <Panel
      header={
        <FlexboxGrid align="middle" style={{ gap: 8 }}>
          <FlexboxGrid.Item><Activity size={16} color="#34c3ff" /></FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ fontWeight: 600 }}>Server Load</FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <Tag color={isError ? 'red' : isLoading && !data ? 'yellow' : 'green'} size="sm">
              {isError ? 'offline' : isLoading && !data ? 'connecting' : 'live'}
            </Tag>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      }
      style={{ background: '#1a1d24', marginTop: 24 }}
      bordered
    >
      {isLoading && !data && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Loader size="md" content="Connecting…" />
        </div>
      )}
      {isError && (
        <p style={{ color: '#f55', textAlign: 'center', padding: 16 }}>Could not reach server</p>
      )}
      {data && (
        <Grid fluid>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <MeterRow
                label="Heap Used"
                value={data.heap_alloc_mb}
                max={Math.max(data.heap_sys_mb, 1)}
                unit="MB"
                color="#34c3ff"
              />
              <MeterRow
                label="Goroutines"
                value={data.goroutines}
                max={200}
                unit=""
                color="#52c41a"
              />
            </Col>
            <Col xs={24} md={12}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <Cpu size={15} color="#faad14" />, label: 'GC Runs', val: String(data.gc_runs) },
                  { icon: <Server size={15} color="#34c3ff" />, label: 'Heap Sys', val: `${data.heap_sys_mb.toFixed(1)} MB` },
                  { icon: <Clock size={15} color="#52c41a" />, label: 'Uptime', val: formatUptime(data.uptime_seconds) },
                ].map(({ icon, label, val }) => (
                  <FlexboxGrid key={label} align="middle">
                    <FlexboxGrid.Item style={{ marginRight: 8 }}>{icon}</FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ color: '#aaa', fontSize: 13 }}>{label}</FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginLeft: 'auto', color: '#fff', fontWeight: 600 }}>{val}</FlexboxGrid.Item>
                  </FlexboxGrid>
                ))}
              </div>
            </Col>
          </Row>
        </Grid>
      )}
    </Panel>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<ServerStats>({
    queryKey: ['stats'],
    queryFn: statsApi.get,
    refetchInterval: 5000,
  })

  return (
    <div>
      <h4 style={{ marginBottom: 24, color: '#fff' }}>Dashboard</h4>

      <Grid fluid>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <StatCard
              title="Domains"
              value={stats?.domain_count ?? '—'}
              icon={<Globe size={22} />}
              color="#34c3ff"
              loading={isLoading && !stats}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard
              title="Endpoints"
              value={stats?.endpoint_count ?? '—'}
              icon={<GitBranch size={22} />}
              color="#52c41a"
              loading={isLoading && !stats}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard
              title="Users"
              value={stats?.user_count ?? '—'}
              icon={<Users size={22} />}
              color="#faad14"
              loading={isLoading && !stats}
            />
          </Col>
        </Row>
      </Grid>

      <ServerMonitor />
    </div>
  )
}

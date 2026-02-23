import React from 'react'
import { Panel, Grid, Row, Col, FlexboxGrid } from 'rsuite'
import GlobalIcon from '@rsuite/icons/Global'
import BranchIcon from '@rsuite/icons/Branch'
import PeoplesIcon from '@rsuite/icons/Peoples'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Panel
      style={{
        background: '#1a1d24',
        borderRadius: 8,
        border: `1px solid ${color}33`,
      }}
    >
      <FlexboxGrid justify="space-between" align="middle">
        <FlexboxGrid.Item>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff' }}>{value}</div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color,
            }}
          >
            {icon}
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Panel>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <h4 style={{ marginBottom: 24, color: '#fff' }}>Dashboard</h4>
      <Grid fluid>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <StatCard title="Domains" value="—" icon={<GlobalIcon />} color="#34c3ff" />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard title="Endpoints" value="—" icon={<BranchIcon />} color="#52c41a" />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard title="Connected Users" value="—" icon={<PeoplesIcon />} color="#faad14" />
          </Col>
        </Row>
      </Grid>

      <Panel
        header="Quick Links"
        style={{ marginTop: 24, background: '#1a1d24' }}
        bordered
      >
        <p style={{ color: '#aaa' }}>
          Use the sidebar to manage <strong style={{ color: '#34c3ff' }}>Domains</strong>,{' '}
          <strong style={{ color: '#52c41a' }}>Endpoints</strong>, and{' '}
          <strong style={{ color: '#faad14' }}>Users</strong>.
        </p>
      </Panel>
    </div>
  )
}

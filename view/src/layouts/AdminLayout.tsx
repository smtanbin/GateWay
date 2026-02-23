import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  Container,
  Sidebar,
  Sidenav,
  Header,
  Content,
  Navbar,
  Nav,
  IconButton,
  Avatar,
  Dropdown,
  Breadcrumb,
  DOMHelper,
} from 'rsuite'
import MenuIcon from '@rsuite/icons/Menu'
import DashboardIcon from '@rsuite/icons/Dashboard'
import GlobalIcon from '@rsuite/icons/Global'
import BranchIcon from '@rsuite/icons/Branch'
import brandLogo from '../assets/brand.webp'

const { getHeight } = DOMHelper

const navItems = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/domains', label: 'Domains', icon: <GlobalIcon /> },
  { to: '/endpoints', label: 'Endpoints', icon: <BranchIcon /> },
  { to: '/users', label: 'Users', icon: <PeoplesIcon /> },
]

export default function AdminLayout() {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()

  return (
    <Container style={{ minHeight: '100vh' }}>
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column' }}
        width={expanded ? 240 : 56}
        collapsible
      >
        <Sidenav.Header>
          <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={brandLogo}
              alt="GateWay"
              style={{ height: 32, width: 32, objectFit: 'contain', flexShrink: 0 }}
            />
            {expanded && (
              <span style={{ fontSize: 16, fontWeight: 'bold', color: '#34c3ff', whiteSpace: 'nowrap' }}>
                GateWay
              </span>
            )}
          </div>
        </Sidenav.Header>
        <Sidenav expanded={expanded} defaultOpenKeys={['3']}>
          <Sidenav.Body>
            <Nav>
              {navItems.map((item) => (
                <Nav.Item
                  key={item.to}
                  icon={item.icon}
                  as={NavLink}
                  to={item.to}
                  end={item.to === '/'}
                >
                  {item.label}
                </Nav.Item>
              ))}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <Sidenav.Toggle
          expanded={expanded}
          onToggle={(exp) => setExpanded(exp)}
        />
      </Sidebar>

      <Container>
        <Header>
          <Navbar>
            <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={brandLogo} alt="GateWay" style={{ height: 28, objectFit: 'contain' }} />
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Admin</span>
            </Navbar.Brand>
            <Nav pullRight>
              <Dropdown
                title={<Avatar circle size="sm" style={{ background: '#34c3ff' }}>A</Avatar>}
              >
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item>Logout</Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar>
        </Header>

        <Content style={{ padding: '24px' }}>
          <Outlet />
        </Content>
      </Container>
    </Container>
  )
}

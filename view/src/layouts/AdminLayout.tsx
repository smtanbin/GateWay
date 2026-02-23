import { useState } from 'react'
import { Outlet, NavLink } from 'react-router'
import {
  Container,
  Sidebar,
  Sidenav,
  Header,
  Content,
  Navbar,
  Nav,
  Avatar,
  Dropdown,
} from 'rsuite'
import { LayoutDashboard, Globe, GitBranch, Users } from 'lucide-react'
import fullLogo from '../assets/brand.webp'

const navItems = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { to: '/domains', label: 'Domains', icon: <Globe size={16} /> },
  { to: '/endpoints', label: 'Endpoints', icon: <GitBranch size={16} /> },
  { to: '/users', label: 'Users', icon: <Users size={16} /> },
]

export default function AdminLayout() {
  const [expanded, setExpanded] = useState(true)

  return (
    <Container style={{ minHeight: '100vh' }}>
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column' }}
        width={expanded ? 240 : 56}
        collapsible
      >
        <Sidenav.Header>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', overflow: 'hidden', height: 56 }}>
          <img src={fullLogo} alt="One Gateway" style={{ height: 20, objectFit: 'contain' }} />
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
          onToggle={(exp) => setExpanded(exp)}
        />
      </Sidebar>

      <Container>
        <Header>
          <Navbar>
            <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center' }}>
              Home
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

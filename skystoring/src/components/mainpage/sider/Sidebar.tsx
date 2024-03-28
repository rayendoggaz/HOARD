import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  PushpinOutlined,
  HomeOutlined,
  FolderOpenOutlined,
  StarOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Typography ,Button} from 'antd';
import { Link } from 'react-router-dom';
import PinnedFilesPage from '../pin/PinnedFilesPage';
import "./sidebar.css";

const { Sider } = Layout;

interface SidebarProps {
  onSelectContent: (content: string) => void;
}

type MenuItem = {
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode; // Add the label property
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const Sidebar: React.FC<{onmystoringclick: () => void; onSidebarItemClick: (content: string) => void ;onPinnedClick: () => void ; onhomeclick: () => void}> = ({
  onmystoringclick,
  onSidebarItemClick,
  onPinnedClick,
  onhomeclick,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

    
  const items: MenuItem[] = [
    getItem(<span onClick={onhomeclick}>Home</span>,
    '1',
    <HomeOutlined />,),
    
    getItem(<span onClick={onmystoringclick}>Hoard</span>,
    '2',
    <FolderOpenOutlined />,),
    getItem(
      <span onClick={onPinnedClick}>Starred</span>,
      '9',
      <StarOutlined />
    ),
  ];

  return (
    <Sider
      style={{ background: 'white', position: 'fixed', height: '100vh', left: 0}}
    >
      <div style={{ display: 'flex', marginTop: '50px', marginRight: '15px' }}>
      </div>
      <Menu style={{marginTop:"20px"}} theme="light" defaultSelectedKeys={['1']} mode="vertical" items={items} >
      </Menu>
    </Sider>
  );
};

export default Sidebar;
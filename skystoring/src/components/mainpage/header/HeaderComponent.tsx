import React, { useState, useEffect, useRef } from 'react';
import { Input, Space, Avatar, Popover, Button, AutoComplete, UploadFile } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AudioOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'; // Import Ant Design Icons
import LogoutButton from './LogoutButton';
import axios from 'axios';
import "./Header.css";

const { Search } = Input;

export interface FileType extends UploadFile<any> {
  id: null | undefined;
  uid: string;
  name: string;
  file: string;
  folderId: number;
}

const UserMenu: React.FC<{ username: string; onLogout: () => void }> = ({ username, onLogout }) => (
  <div className="user-menu">
    <Avatar size={64} icon={<UserOutlined />} className="user-menu-avatar" />
    <p className="user-menu-username">{username}</p>
    <Button type="link" icon={<SettingOutlined />} className="user-menu-button" onClick={() => console.log('Settings clicked')}>
      Settings
    </Button>
    <div className="logout-button-wrapper">
      <LogoutButton onLogout={onLogout} />
    </div>
  </div>
);




  
const HeaderComponent: React.FC<{ onSearchButtonClick: (query: string) => void }> = ({ onSearchButtonClick }) => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [searchOptions, setSearchOptions] = useState<FileType[]>([]); // Changed to FileType[]
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/auth/user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    setUsername('');
    setUserMenuVisible(false);
  };

  const getFileNameFromUrl = (file: string) => {
    const parts = file.split('/');
    return parts[parts.length - 1];
  };

  const onSelectOption = (value: string) => {
    console.log('Selected file:', value);
    navigateToSearchResults(value); // Navigate to search results with the selected file name
  };

  const navigateToSearchResults = (query: string) => {
    console.log('Navigating to search results with query:', query);
    onSearchButtonClick(query);
    setSearchOptions([]);
  };

  const onSearch = async (value: string) => {
    if (!value.trim()) {
      console.log('Empty search value, skipping API request');
      return;
    }
  
    console.log('Search input value:', value);
  
    const queryWithoutUploads = value.replace(/\/uploads\//g, ''); // Remove "/uploads/" prefix
    console.log('Query without uploads:', queryWithoutUploads); // Log the modified query
  
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:8000/api/search/?query=${queryWithoutUploads}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const filteredFiles = response.data.filter((file: FileType) =>
        getFileNameFromUrl(file.file).toLowerCase().includes(queryWithoutUploads.toLowerCase())
      );
  
      const filesWithNames = filteredFiles.map((file: FileType) => ({
        ...file,
        name: getFileNameFromUrl(file.file), // Extract filename without /uploads/ prefix
      }));
  
      console.log('Files fetched successfully:', filesWithNames);
      setSearchOptions(filesWithNames); // Set search options with filenames without /uploads/ prefix
  
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };  

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.ant-select-dropdown') && searchOptions.length > 0) {
      setSearchOptions([]); // Close the dropdown only if it's open and clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'white', position: 'fixed', width: '100%', zIndex: 1000, height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <Popover
        content={<UserMenu username={username} onLogout={handleLogout} />}
        trigger="click"
        open={userMenuVisible}
        onOpenChange={(visible) => setUserMenuVisible(visible)}
      >
        <Avatar
          icon={<UserOutlined style={{ paddingTop: '9px' }} />}
          style={{ position: 'absolute', right: '28px', top: '15px', width: '40px', height: '40px', cursor: 'pointer', alignContent: 'centre' }}
        />
      </Popover>
      
      {/* Search bar */}
      <AutoComplete
        style={{ width: '440px', paddingRight: '10px', marginLeft: '40%', marginTop: '-15px'}}
        onSearch={onSearch}
      >
        <Search
          placeholder="Input search text"
          allowClear
          enterButton={<Button style={{ height: '50px' }}>Search</Button>}
          onSearch={onSearchButtonClick}
        />
      </AutoComplete>
      
      {/* Search options dropdown */}
      {searchOptions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="dropdown-menu"
          style={{ 
            position: 'absolute', 
            width: '352px', 
            left: "40.3%",
            top: "55px", 
            backgroundColor: 'white', 
            border: '1px solid #d9d9d9', 
            borderRadius: '4px', 
            marginTop: '8px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
            zIndex: '1',
            maxHeight: '300px', // Set maximum height for scrollability
            overflowY: 'auto'    // Enable vertical scrolling if needed
          }}
        >
          {/* Make each dropdown option clickable */}
          <div className="dropdown-menu">
            {searchOptions.map((option) => (
              <div key={option.id} className="dropdown-menu-item" style={{ padding: '8px', borderBottom: '1px solid #d9d9d9', cursor: 'pointer' }} onClick={() => onSelectOption(option.name)}>
                {getFileNameFromUrl(option.file)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StopOutlined } from '@ant-design/icons';
import { FileType } from '../files/filelist';
import './pinnedFilesPage.css'; // Import the CSS file

const PinnedFilesPage: React.FC = () => {
  const [pinnedFiles, setPinnedFiles] = useState<FileType[]>([]);

  useEffect(() => {
    const fetchPinnedFiles = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // Handle the case where token is not available
          console.error('Access token not found.');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/files/pinned/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filesWithNames = response.data?.map((file: FileType) => ({
          ...file,
          name: getFileNameFromUrl(file.file),
        }));

        setPinnedFiles(filesWithNames);
        
      } catch (error) {
        console.error('Error fetching pinned files:', error);
      }
    };

    fetchPinnedFiles();
  }, []);
  const getFileNameFromUrl = (file: string) => {
    const parts = file.split('/');
    return parts[parts.length - 1];
  };

  const handleUnpin = async (fileId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Access token not found.');
        return;
      }

      await axios.delete(`http://localhost:8000/api/files/unpin/${fileId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

      // Remove the unpinned file from the state
      setPinnedFiles(prevFiles => prevFiles.filter(file => file.uid !== fileId));
    } catch (error) {
      console.error('Error unpinning file:', error);
    }
  };

  return (
    <div className="pinned-files-container">
      <h2 className="pinned-files-title">Starred</h2>
      {pinnedFiles.map((file) => (
        <div key={file.uid} className="pinned-file">
          <p className="pinned-file-name">{file.name}</p>
          <button className="unpin-button" onClick={() => handleUnpin(file.uid)}>
            <StopOutlined /> {/* Use StopOutlined icon */}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PinnedFilesPage;

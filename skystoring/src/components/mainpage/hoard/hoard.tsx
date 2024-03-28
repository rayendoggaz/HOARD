import React from 'react';
import FolderList from '../folders/folderlist';
import FileList, { FileType } from '../files/filelist';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "./hoard.css";

const hoard = () => {
  const handleFileDrop = (result: any) => {
    // Logic for handling file drop
    console.log('File dropped!', result);

    // You can perform actions based on the dropped file, e.g., update state, make API calls, etc.

    // For example, if you want to update the state with the dropped files:
    // const droppedFiles: FileType[] = result.files;
    // Update state or perform other actions with droppedFiles
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="cont">
        {/* Render only the FolderList component */}
        <FolderList />
        <FileList
          searchQuery="" // Provide the appropriate search query
          onSelect={(files: FileType[]) => {
            // Implement the onSelect logic if needed
          }}
          onFileDrop={handleFileDrop} 
          folders={[]} // Provide the appropriate folders
        />
      </div>
    </DndProvider>
  );
};

export default hoard;

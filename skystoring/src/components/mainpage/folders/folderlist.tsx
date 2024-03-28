import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { List, Form, Input, message, Button, Modal } from "antd";
import axios from "axios";
import { FolderOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import "./FolderList.css";

import { FileType } from "../files/filelist";

import { HTML5Backend } from "react-dnd-html5-backend";

const getFileNameFromUrl = (file: string) => {
  const parts = file.split("/");
  return parts[parts.length - 1];
};


interface Folder {
  id: number;
  name: string;
  files: { uid: string; name: string }[];
}

interface DraggableFolder extends Folder {
  index: number;
}

interface FolderListProps {}

const FolderList: React.FC<FolderListProps> = () => {
  const [folders, setFolders] = useState<DraggableFolder[]>([]);
  const [form] = Form.useForm();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFileListVisible, setIsFileListVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      axios
        .get("http://localhost:8000/api_folder/folders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("API Response:", response.data);
          console.log(response.data);
          console.log(token);

          if (Array.isArray(response.data)) {
            const draggableFolders = response.data.map(
              (folder: Folder, index: number) => ({
                ...folder,
                index,
              })
            );
            setFolders(draggableFolders);
          } else {
            console.error("API response is not an array:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching folders:", error);
        });
    } else {
      console.error("No valid token found");
    }
  }, []);

  const onFinish = () => {
    setIsModalOpen(true);
  };

  const handleCreateFolder = async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api_folder/folders/",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newFolder: DraggableFolder = {
        ...response.data,
        index: folders.length,
      };
      setFolders((prevFolders) => [...prevFolders, newFolder]);
      form.resetFields();
      message.success("Folder created successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating folder:", error);
      message.error("Failed to create folder.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleFolderClick = async (folderId: number) => {
    setSelectedFolderId(folderId);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:8000/api_folder/folders/${folderId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedFolder(response.data);
    } catch (error) {
      console.error("Error fetching folder details:", error);
      message.error("Failed to fetch folder details.");
    }
    setIsFileListVisible(!isFileListVisible);
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      await axios.delete(`http://localhost:8000/api_folder/folders/${folderId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== folderId));
      message.success("Folder deleted successfully");
    } catch (error) {
      console.error("Error deleting folder:", error);
      message.error("Failed to delete folder.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedFolders = Array.from(folders);
    const [removed] = reorderedFolders.splice(result.source.index, 1);
    reorderedFolders.splice(result.destination.index, 0, removed);

    setFolders(reorderedFolders);
  };

  const [, drop] = useDrop({
    accept: "FILE",
    drop: (item: any) => {
      if (selectedFolder) {
        moveFileToFolder(item.file.uid, selectedFolder.id);
      }
    },
  });

  const moveFileToFolder = async (fileId: string, targetFolderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:8000/api_folder/folders/${targetFolderId}/moveFile/`,
        { fileId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filesWithNames = response.data?.map((file: FileType) => ({
        ...file,
        name: getFileNameFromUrl(file.file),
      }));
      console.log(response.data);
    } catch (error) {
      console.error("Error moving file to folder:", error);
      message.error("Failed to move file to folder.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="folders" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} {...drop}>
              <Button
                className="create-folder-button"
                type="primary"
                onClick={showModal}
              >
                Create Folder
              </Button>
              <Modal
                title="Create Folder"
                visible={isModalOpen}
                onOk={handleCreateFolder}
                onCancel={handleCancel}
                destroyOnClose
              >
                <Form form={form} onFinish={onFinish}>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Please enter folder name" },
                    ]}
                  >
                    <Input placeholder="Enter folder name" />
                  </Form.Item>
                </Form>
              </Modal>

              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={folders}
                renderItem={(draggableFolder, index) => (
                  <Draggable
                    key={draggableFolder.id}
                    draggableId={draggableFolder.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleFolderClick(draggableFolder.id)}
                        className="folder-item"
                      >
                        <FolderOutlined
                          style={{ fontSize: "24px", color: "#1890ff" }}
                        />
                        <span className="folder-title">
                          {draggableFolder.name}
                        </span>

                        {selectedFolderId === draggableFolder.id &&
                          selectedFolder &&
                          isFileListVisible && (
                            <div>
                              <ul>
                                {selectedFolder.files.map((file) => (
                                  <li key={file.uid}>{file.uid}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* Delete button */}
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(draggableFolder.id);
                          }}
                          className="delete-button" // Add className here
                        />
                      </div>
                    )}
                  </Draggable>
                )}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </DndProvider>
  );
};

export default FolderList;

import React, { useState, useEffect } from "react";
import { Layout, Button, Space, Typography } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import Sidebar from "./sider/Sidebar";
import HeaderComponent from "./header/HeaderComponent";
import FolderList from "./folders/folderlist";
import FileList, { FileType } from "./files/filelist";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import PinnedFilesPage from "./pin/PinnedFilesPage";
import MyStoring from "./hoard/hoard";
import SearchResults from "./search/SearchResults";
import "./mainpage.css";

const { Header, Content, Footer } = Layout;

export interface FolderType {
  id: number;
  name: string;
}

const MainPage: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string>("filelist");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [menu, setMenu] = useState<string>("home");

  const handleButtonClick = (content: string) => {
    setSelectedContent(content);
  };

  const navigateToSearchResults = (query: string) => {
    setSearchQuery(query);
  };

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://192.168.11.45:8000/api_folder/folders/",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use Bearer for Authorization
          },
        }
      );

      setFolders(response.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent onSearchButtonClick={navigateToSearchResults} />
      <Layout>
        <Sidebar
          onhomeclick={() => setMenu("home")}
          onmystoringclick={() => setMenu("mystoring")}
          onSidebarItemClick={handleButtonClick}
          onPinnedClick={() => setMenu("pinned")}
        />
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            {menu === "home" && (
              <p style={{ fontSize: "35px", paddingTop: "15px" }} id="Title">
                {selectedContent === "filelist" ? (
                  <>
                    Home
                  </>
                ) : (
                  <>
                    Home
                  </>
                )}
              </p>
            )}
            <div
              style={{
                padding: 24,
                minHeight: 360,
                borderRadius: "yourRadius",
                background: "#yourContentBgColor",
              }}
            >
              {menu === "home" && (
                <Space style={{ marginBottom: "12px" }}>
                  <Button
                    className="neubrutalism-button"
                    size="large"
                    type="primary"
                    icon={<FileOutlined />}
                    onClick={() => handleButtonClick("filelist")}
                  >
                    Files
                  </Button>
                  <Button
                    className="neubrutalism-button"
                    size="large"
                    type="primary"
                    icon={<FolderOutlined />}
                    onClick={() => handleButtonClick("folderlist")}
                  >
                    Folders
                  </Button>
                </Space>
              )}
              <Layout>
                <DndProvider backend={HTML5Backend}>
                  {searchQuery ? (
                    <SearchResults query={searchQuery} />
                  ) : (
                    <>
                      {menu === "home" ? (
                        <>
                          {selectedContent === "filelist" ? (
                            <FileList
                              searchQuery={searchQuery}
                              onSelect={() => {}}
                              onFileDrop={() => {}}
                              onMoveToFolder={(files, folderId) => {
                                console.log(
                                  `Move files to folder ${folderId}`,
                                  files
                                );
                              }}
                              folders={folders}
                            />
                          ) : selectedContent === "folderlist" ? (
                            <FolderList />
                          ) : null}
                        </>
                      ) : menu === "mystoring" ? (
                        <MyStoring />
                      ) : (
                        <PinnedFilesPage />
                      )}
                    </>
                  )}
                </DndProvider>
              </Layout>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainPage

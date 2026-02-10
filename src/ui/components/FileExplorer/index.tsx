import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileItem[];
}

const FileExplorer: React.FC = () => {
  const { t } = useTranslation();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [showDevices, setShowDevices] = useState(false);
  const [devices, setDevices] = useState<FileItem[]>([]);

  const openFolder = () => {
    // 显示设备列表
    setShowDevices(true);
    // 模拟设备列表
    const mockDevices: FileItem[] = [
      {
        id: 'device-c',
        name: 'Local Disk (C:)',
        type: 'directory',
        path: 'C:'
      },
      {
        id: 'device-d',
        name: 'Local Disk (D:)',
        type: 'directory',
        path: 'D:'
      },
      {
        id: 'device-e',
        name: 'Local Disk (E:)',
        type: 'directory',
        path: 'E:'
      }
    ];
    setDevices(mockDevices);
  };

  const browseDevice = (devicePath: string) => {
    setLoading(true);
    setTimeout(() => {
      // 模拟设备根目录下的文件夹
      const mockFileTree: FileItem[] = [
        {
          id: `dir-${Date.now()}-1`,
          name: 'Users',
          type: 'directory',
          path: `${devicePath}\\Users`
        },
        {
          id: `dir-${Date.now()}-2`,
          name: 'Program Files',
          type: 'directory',
          path: `${devicePath}\\Program Files`
        },
        {
          id: `dir-${Date.now()}-3`,
          name: 'Program Files (x86)',
          type: 'directory',
          path: `${devicePath}\\Program Files (x86)`
        },
        {
          id: `dir-${Date.now()}-4`,
          name: 'Windows',
          type: 'directory',
          path: `${devicePath}\\Windows`
        }
      ];
      setCurrentPath(devicePath);
      setFileTree(mockFileTree);
      setShowDevices(false);
      setLoading(false);
    }, 500);
  };

  const browseFolder = (folderPath: string) => {
    setLoading(true);
    setTimeout(() => {
      // 模拟文件夹下的内容
      const mockFileTree: FileItem[] = [
        {
          id: `dir-${Date.now()}-1`,
          name: 'Documents',
          type: 'directory',
          path: `${folderPath}\\Documents`
        },
        {
          id: `dir-${Date.now()}-2`,
          name: 'Downloads',
          type: 'directory',
          path: `${folderPath}\\Downloads`
        },
        {
          id: `dir-${Date.now()}-3`,
          name: 'Desktop',
          type: 'directory',
          path: `${folderPath}\\Desktop`
        },
        {
          id: `file-${Date.now()}-1`,
          name: 'example.txt',
          type: 'file',
          path: `${folderPath}\\example.txt`
        }
      ];
      setCurrentPath(folderPath);
      setFileTree(mockFileTree);
      setLoading(false);
    }, 500);
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      // 模拟创建新文件夹
      setLoading(true);
      setTimeout(() => {
        const newFolder: FileItem = {
          id: `folder-${Date.now()}`,
          name: newFolderName.trim(),
          type: 'directory',
          path: `${currentPath}\\${newFolderName.trim()}`
        };
        setFileTree(prev => [...prev, newFolder]);
        setShowNewFolderDialog(false);
        setNewFolderName('');
        setLoading(false);
      }, 300);
    }
  };

  const refreshFileTree = () => {
    // 模拟刷新文件树
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const getFileIcon = (type: string, name: string): React.ReactNode => {
    if (type === 'directory') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts':
      case 'tsx':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'js':
      case 'jsx':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'json':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.87 15 19 11.87 19 8C19 4.13 15.87 1 12 1C8.13 1 5 4.13 5 8C5 11.87 8.13 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C12 15 15 21 15 21H9C9 21 12 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'md':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  const renderFileItem = (item: FileItem) => {
    return (
      <FileItemContainer key={item.id}>
        <FileIcon>{getFileIcon(item.type, item.name)}</FileIcon>
        <FileName>{item.name}</FileName>
        <FileActions>
          {item.type === 'directory' && (
            <ActionButton onClick={() => console.log('Open directory:', item.path)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ActionButton>
          )}
        </FileActions>
      </FileItemContainer>
    );
  };

  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    createNewFolder();
  };

  return (
    <Container>
      <Header>
        <Title>File Browser</Title>
        <Actions>
          <ActionButton onClick={openFolder} title="Open Folder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Open
          </ActionButton>
          <ActionButton onClick={() => setShowNewFolderDialog(true)} title="New Folder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New
          </ActionButton>
          <ActionButton onClick={refreshFileTree} title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12A9 9 0 1 1 11.64 3.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
        </Actions>
      </Header>
      
      {currentPath && (
        <PathBar>
          <PathText>{currentPath}</PathText>
        </PathBar>
      )}
      
      {loading ? (
        <LoadingState>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12A9 9 0 1 1 11.64 3.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text>Loading...</Text>
        </LoadingState>
      ) : fileTree.length > 0 ? (
        <FileListContainer>
          {fileTree.map(item => renderFileItem(item))}
        </FileListContainer>
      ) : (
        <EmptyState>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text>No folder opened</Text>
          <SubText>Click "Open" to select a folder</SubText>
        </EmptyState>
      )}
      
      {showNewFolderDialog && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>New Folder</DialogTitle>
            <form onSubmit={handleCreateNewFolder}>
              <InputField>
                <label htmlFor="folderName">Folder Name:</label>
                <input
                  id="folderName"
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </InputField>
              <DialogActions>
                <Button type="button" onClick={() => setShowNewFolderDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newFolderName.trim()}>
                  Create
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </NewFolderDialog>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 10px;
  color: #e0e0e0;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const PathBar = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
`;

const PathText = styled.div`
  font-size: 12px;
  color: #888888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  color: #888888;
`;

const Text = styled.p`
  font-size: 14px;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  color: #888888;
`;

const FileListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FileItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const FileIcon = styled.div`
  font-size: 16px;
  width: 20px;
  flex-shrink: 0;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
  flex: 1;
`;

const FileActions = styled.div`
  display: flex;
  gap: 4px;
`;

const NewFolderDialog = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
`;

const DialogTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 16px 0;
`;

const InputField = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 14px;
    color: #e0e0e0;
    margin-bottom: 6px;
  }

  input {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 8px 12px;
    color: #e0e0e0;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #007acc;
    }
  }
`;

const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:first-child {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e0e0e0;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &:last-child {
    background-color: #007acc;
    border: 1px solid #007acc;
    color: white;

    &:hover {
      background-color: #0066b3;
    }

    &:disabled {
      background-color: rgba(0, 122, 204, 0.5);
      border-color: rgba(0, 122, 204, 0.5);
      cursor: not-allowed;
    }
  }
`;

export default FileExplorer;
import React, { useState, useEffect } from 'react';
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
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // 模拟文件树数据
  useEffect(() => {
    // 模拟加载文件树
    setTimeout(() => {
      const mockFileTree: FileItem[] = [
        {
          id: '1',
          name: 'src',
          type: 'directory',
          path: './src',
          children: [
            {
              id: '2',
              name: 'core',
              type: 'directory',
              path: './src/core',
              children: [
                {
                  id: '3',
                  name: 'metaclass',
                  type: 'directory',
                  path: './src/core/metaclass',
                  children: [
                    {
                      id: '4',
                      name: 'MetaclassSystem.ts',
                      type: 'file',
                      path: './src/core/metaclass/MetaclassSystem.ts'
                    },
                    {
                      id: '5',
                      name: 'MetaclassRegistry.ts',
                      type: 'file',
                      path: './src/core/metaclass/MetaclassRegistry.ts'
                    }
                  ]
                },
                {
                  id: '6',
                  name: 'aeid',
                  type: 'directory',
                  path: './src/core/aeid',
                  children: [
                    {
                      id: '7',
                      name: 'AEIDSystem.ts',
                      type: 'file',
                      path: './src/core/aeid/AEIDSystem.ts'
                    }
                  ]
                }
              ]
            },
            {
              id: '8',
              name: 'ui',
              type: 'directory',
              path: './src/ui',
              children: [
                {
                  id: '9',
                  name: 'components',
                  type: 'directory',
                  path: './src/ui/components'
                },
                {
                  id: '10',
                  name: 'pages',
                  type: 'directory',
                  path: './src/ui/pages'
                }
              ]
            },
            {
              id: '11',
              name: 'cli',
              type: 'directory',
              path: './src/cli'
            }
          ]
        },
        {
          id: '12',
          name: 'public',
          type: 'directory',
          path: './public',
          children: [
            {
              id: '13',
              name: 'assets',
              type: 'directory',
              path: './public/assets',
              children: [
                {
                  id: '14',
                  name: 'logos',
                  type: 'directory',
                  path: './public/assets/logos',
                  children: [
                    {
                      id: '15',
                      name: 'logo.jpg',
                      type: 'file',
                      path: './public/assets/logos/logo.jpg'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '16',
          name: 'package.json',
          type: 'file',
          path: './package.json'
        },
        {
          id: '17',
          name: 'README.md',
          type: 'file',
          path: './README.md'
        },
        {
          id: '18',
          name: 'vite.config.ts',
          type: 'file',
          path: './vite.config.ts'
        }
      ];

      setFileTree(mockFileTree);
      setLoading(false);
    }, 500);
  }, []);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const isNodeExpanded = (nodeId: string) => {
    return expandedNodes.has(nodeId);
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

  const renderFileItem = (item: FileItem, level: number = 0) => {
    const hasChildren = item.type === 'directory' && item.children && item.children.length > 0;
    const isExpanded = isNodeExpanded(item.id);

    return (
      <FileItemContainer key={item.id} level={level}>
        <FileItemHeader onClick={() => hasChildren && toggleNode(item.id)}>
          {hasChildren && (
            <ExpandButton onClick={(e) => {
              e.stopPropagation();
              toggleNode(item.id);
            }}>
              {isExpanded ? '▼' : '▶'}
            </ExpandButton>
          )}
          {!hasChildren && <Spacer />}
          <FileIcon>{getFileIcon(item.type, item.name)}</FileIcon>
          <FileName>{item.name}</FileName>
        </FileItemHeader>

        {hasChildren && isExpanded && item.children && (
          <FileItemChildren>
            {item.children.map(child => renderFileItem(child, level + 1))}
          </FileItemChildren>
        )}
      </FileItemContainer>
    );
  };

  return (
    <Container>
      <Title>File Explorer</Title>
      {loading ? (
        <LoadingState>
          <Icon>🔄</Icon>
          <Text>Loading file structure...</Text>
        </LoadingState>
      ) : (
        <FileTreeContainer>
          {fileTree.map(item => renderFileItem(item))}
        </FileTreeContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
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

const Icon = styled.div`
  font-size: 24px;
`;

const Text = styled.p`
  font-size: 14px;
  margin: 0;
`;

const FileTreeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FileItemContainer = styled.div<{ level: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.level * 20}px;
`;

const FileItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #888888;
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #e0e0e0;
  }
`;

const Spacer = styled.div`
  width: 12px;
`;

const FileIcon = styled.div`
  font-size: 16px;
  width: 20px;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
  flex: 1;
`;

const FileItemChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
`;

export default FileExplorer;
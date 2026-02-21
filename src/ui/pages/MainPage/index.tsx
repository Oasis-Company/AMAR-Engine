import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import MediaUploader from '@/ui/components/MediaUploader';
import FileExplorer from '@/ui/components/FileExplorer';
import SceneGraph from '@/ui/components/SceneGraph';
import SystemViewport from '@/ui/components/SystemViewport';
import StatusBar from '@/ui/components/StatusBar';
import LanguageSelector from '@/ui/components/LanguageSelector';

interface SceneObject {
  id: string;
  name: string;
  type: string;
  aeid?: string;
  metaclass?: string;
  properties?: Record<string, any>;
  children?: SceneObject[];
}

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [scene, setScene] = useState<SceneObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState(t('statusBar.status.idle'));
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'uploader' | 'explorer'>('uploader');

  const handleMediaUpload = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0) {
      processMedia(files);
    } else {
      setStatus('idle');
      setStatusMessage('Ready');
      setScene(null);
    }
  };

  const processMedia = async (files: File[]) => {
    setStatus('processing');
    setStatusMessage(t('statusBar.status.processing'));
    setProgress(0);
    setError(undefined);
    setSelectedObject(null);

    // 模拟处理过程
    try {
      // 模拟上传进度
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // 模拟场景生成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成模拟场景数据
      const mockScene: SceneObject = {
        id: 'scene-1',
        name: 'Living Room',
        type: 'scene',
        aeid: 'SCN-202602101500-12345678-ABCD',
        children: [
          {
            id: 'obj-1',
            name: 'Coffee Table',
            type: 'table',
            aeid: 'FUR-202602101501-87654321-DCBA',
            metaclass: 'Furniture',
            properties: {
              material: 'Wood',
              color: 'Brown',
              dimensions: '120x60x45cm'
            }
          },
          {
            id: 'obj-2',
            name: 'Coffee Cup',
            type: 'cup',
            aeid: 'OBJ-202602101502-13579246-FEDC',
            metaclass: 'Container',
            properties: {
              material: 'Ceramic',
              color: 'White',
              capacity: '300ml'
            }
          },
          {
            id: 'obj-3',
            name: 'Chair',
            type: 'chair',
            aeid: 'FUR-202602101503-24681357-BA98',
            metaclass: 'Furniture',
            properties: {
              material: 'Wood',
              color: 'Brown',
              style: 'Modern'
            }
          }
        ]
      };

      setScene(mockScene);
      setStatus('success');
      setStatusMessage(t('statusBar.status.success', { count: files.length }));
      setProgress(undefined);
    } catch (err) {
      setStatus('error');
      setStatusMessage('Error processing media');
      setError((err as Error).message);
      setProgress(undefined);
    }
  };

  const handleObjectSelect = (object: SceneObject) => {
    console.log('Selected object:', object);
    setSelectedObject(object);
  };

  return (
    <Container>
      <Header className="acrylic border">
        <HeaderLeft>
          <Logo>AMAR Engine</Logo>
        </HeaderLeft>
        <HeaderRight>
          <GithubLink href="https://github.com/Oasis-Company/AMAR-Engine" target="_blank" rel="noopener noreferrer">
            <GithubIcon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 16.42 2.87 20.17 6.84 21.5C7.34 21.58 7.5 21.27 7.5 21C7.5 20.77 7.5 20.14 7.5 19.31C4.73 19.91 4.14 17.97 4.14 17.97C3.68 16.81 2.83 16.5 2.83 16.5C2.16 15.88 2.68 15.9 2.68 15.9C3.23 15.97 3.76 16.93 3.76 16.93C4.43 18.45 5.57 18 6.04 17.76C6.12 17.11 6.33 16.67 6.56 16.42C4.78 16.17 2.92 15.31 2.92 12C2.92 10.41 3.54 9.09 4.41 8.16C4.31 7.9 4.1 7.33 4.34 6.96C4.34 6.96 4.77 6.81 6.53 8.09C7.75 7.95 9.14 7.84 10.57 7.84C11.96 7.84 13.35 7.95 14.57 8.09C16.33 6.81 16.76 6.96 16.76 6.96C17 7.33 16.79 7.9 16.69 8.16C17.56 9.09 18.18 10.41 18.18 12C18.18 15.32 16.31 16.16 14.59 16.41C14.91 16.72 15.16 17.33 15.16 18.26C15.16 19.6 15.16 20.68 15.16 21C15.16 21.27 15.32 21.59 15.84 21.5C19.81 20.16 22.68 16.42 22.68 12C22.68 5.37 17.31 0 10.64 0H12Z" fill="currentColor"/>
              </svg>
            </GithubIcon>
            <GithubText>GitHub</GithubText>
          </GithubLink>
          <LanguageSelector />
        </HeaderRight>
      </Header>

      <MainContent>
        <LeftPanel className="acrylic border">
          <TabContainer>
            <TabButton 
              onClick={() => setActiveTab('uploader')}
              isActive={activeTab === 'uploader'}
            >
              <TabIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </TabIcon>
              Media Uploader
            </TabButton>
            <TabButton 
              onClick={() => setActiveTab('explorer')}
              isActive={activeTab === 'explorer'}
            >
              <TabIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </TabIcon>
              File Explorer
            </TabButton>
          </TabContainer>
          <TabContent>
            {activeTab === 'uploader' ? (
              <MediaUploader onMediaUpload={handleMediaUpload} />
            ) : (
              <FileExplorer />
            )}
          </TabContent>
        </LeftPanel>

        <MiddlePanel>
          <SystemViewport 
            scene={scene} 
            selectedObject={selectedObject} 
            onObjectSelect={handleObjectSelect} 
          />
        </MiddlePanel>

        <RightPanel className="acrylic border">
          <SceneGraph scene={scene} onObjectSelect={handleObjectSelect} selectedObject={selectedObject} />
        </RightPanel>
      </MainContent>

      <StatusBar
        status={status}
        message={statusMessage}
        progress={progress}
        error={error}
        scene={scene}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(0, 122, 204, 0.1);
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid rgba(0, 122, 204, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 122, 204, 0.15);
    border-color: rgba(0, 122, 204, 0.3);
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.bodySmall};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GithubIcon = styled.span`
  font-size: 14px;
`;

const GithubText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.bodySmall};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 0 0 320px;
  overflow: hidden;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MiddlePanel = styled.div`
  flex: 1;
  min-width: 400px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RightPanel = styled.div`
  flex: 0 0 380px;
  overflow: hidden;
  border-radius: 4px;
  padding: 16px;
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 8px 12px;
  background-color: ${props => props.isActive ? 'rgba(245, 121, 0, 0.2)' : '#2d2d2d'};
  border: ${props => props.isActive ? '1px solid rgba(245, 121, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-bottom: ${props => props.isActive ? '1px solid rgba(245, 121, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 4px 4px 0 0;
  color: ${props => props.isActive ? '#f57900' : '#e0e0e0'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: ${props => props.isActive ? 'rgba(245, 121, 0, 0.3)' : '#333333'};
  }

  &:focus {
    outline: none;
  }
`;

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

export default MainPage;
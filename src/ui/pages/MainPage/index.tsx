import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import MediaUploader from '@/ui/components/MediaUploader';
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
          <Logo>{t('header.logo')}</Logo>
          <HeaderInfo>
            <Title>{t('header.title')}</Title>
            <Subtitle>{t('header.subtitle')}</Subtitle>
          </HeaderInfo>
        </HeaderLeft>
        <LanguageSelector />
      </Header>

      <MainContent>
        <LeftPanel className="acrylic border">
          <MediaUploader onMediaUpload={handleMediaUpload} />
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
  background-color: #121212;
  color: #e0e0e0;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 8px 8px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #007acc;
  background: rgba(0, 122, 204, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 122, 204, 0.2);
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: #888888;
  margin: 0;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 0 0 350px;
  overflow: hidden;
  border-radius: 8px;
  padding: 20px;
`;

const MiddlePanel = styled.div`
  flex: 1;
  min-width: 400px;
  overflow: hidden;
  border-radius: 8px;
`;

const RightPanel = styled.div`
  flex: 0 0 400px;
  overflow: hidden;
  border-radius: 8px;
  padding: 20px;
`;

export default MainPage;
import React, { useState } from 'react';
import styled from 'styled-components';
import MediaUploader from '@/ui/components/MediaUploader';
import SceneGraph from '@/ui/components/SceneGraph';
import StatusBar from '@/ui/components/StatusBar';

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [scene, setScene] = useState<SceneObject | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('Ready');
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
    setStatusMessage('Processing media...');
    setProgress(0);
    setError(undefined);

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
      setStatusMessage(`Successfully processed ${files.length} file(s)`);
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
    // 这里可以添加选中物体的详细信息显示逻辑
  };

  return (
    <Container>
      <Header>
        <Logo>AME</Logo>
        <Title>AMAR Engine</Title>
        <Subtitle>Next-generation 3D virtual world generator</Subtitle>
      </Header>

      <MainContent>
        <LeftPanel>
          <MediaUploader onMediaUpload={handleMediaUpload} />
        </LeftPanel>

        <RightPanel>
          <SceneGraph scene={scene} onObjectSelect={handleObjectSelect} />
        </RightPanel>
      </MainContent>

      <StatusBar
        status={status}
        message={statusMessage}
        progress={progress}
        error={error}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e1e;
  color: #ffffff;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #3e3e42;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #007acc;
  background-color: #252526;
  padding: 8px 12px;
  border-radius: 4px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
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
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  overflow: hidden;
`;

const RightPanel = styled.div`
  flex: 1;
  min-width: 300px;
  overflow: hidden;
`;

export default MainPage;
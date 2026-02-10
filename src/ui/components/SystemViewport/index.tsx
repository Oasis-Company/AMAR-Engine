import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface SystemViewportProps {
  scene: any;
  selectedObject: any;
  onObjectSelect: (object: any) => void;
}

const SystemViewport: React.FC<SystemViewportProps> = ({ scene, selectedObject, onObjectSelect }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Header>
        <Title>{t('systemViewport.title')}</Title>
        <Controls>
          <ControlButton title={t('systemViewport.controls.rotate')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ControlButton>
          <ControlButton title={t('systemViewport.controls.zoom')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ControlButton>
          <ControlButton title={t('systemViewport.controls.pan')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="4 12 10 12 10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="20 12 14 12 14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ControlButton>
        </Controls>
      </Header>
      
      <ViewportContainer className="acrylic border">
        {scene ? (
          <ScenePreview>
            <Canvas>
              {/* 这里将实现3D预览功能 */}
              <Placeholder>
                <h3>3D Preview</h3>
                <p>Objects detected: {scene.children?.length || 0}</p>
                {scene.children?.map((obj: any) => (
                  <ObjectPlaceholder 
                    key={obj.id} 
                    onClick={() => onObjectSelect(obj)}
                    isSelected={selectedObject?.id === obj.id}
                  >
                    {obj.name}
                  </ObjectPlaceholder>
                ))}
              </Placeholder>
            </Canvas>
          </ScenePreview>
        ) : (
          <EmptyState>
            <Icon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Icon>
            <Text>{t('systemViewport.emptyState')}</Text>
            <SubText>{t('systemViewport.emptySubtext')}</SubText>
          </EmptyState>
        )}
      </ViewportContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const ViewportContainer = styled.div`
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const ScenePreview = styled.div`
  width: 100%;
  height: 100%;
`;

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  position: relative;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  color: #888888;
`;

const ObjectPlaceholder = styled.div<{ isSelected: boolean }>`
  background-color: ${props => props.isSelected ? 'rgba(0, 122, 204, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.isSelected ? '1px solid rgba(0, 122, 204, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease-in-out, slideIn 0.3s ease-in-out;

  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(0, 122, 204, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }

  &:active {
    animation: pulse 0.3s ease-in-out;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
`;

const Icon = styled.div`
  font-size: 48px;
  opacity: 0.5;
`;

const Text = styled.p`
  font-size: 16px;
  color: #888888;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

export default SystemViewport;
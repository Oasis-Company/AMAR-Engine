import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeType } from '../../styles/theme';

interface SystemViewportProps {
  scene: any;
  selectedObject: any;
  onObjectSelect: (object: any) => void;
}

const SystemViewport: React.FC<SystemViewportProps> = ({ scene, selectedObject, onObjectSelect }) => {
  const { t } = useTranslation();
  const theme = useTheme();

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
  gap: ${({ theme }) => theme.spacing.md};
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ControlButton = styled.button`
  background-color: ${({ theme }) => theme.colors.surface.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 6px 10px;
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.hover};
    border-color: ${({ theme }) => theme.colors.accent.primary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.surface.active};
  }
`;

const ViewportContainer = styled.div`
  flex: 1;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ScenePreview = styled.div`
  width: 100%;
  height: 100%;
`;

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.surface.default};
  position: relative;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ObjectPlaceholder = styled.div<{ isSelected: boolean }>`
  background-color: ${props => props.isSelected ? props.theme.colors.accent.muted : props.theme.colors.surface.elevated};
  border: ${props => props.isSelected ? `1px solid ${props.theme.colors.accent.primary}` : `1px solid ${props.theme.colors.border}`};
  border-radius: ${props => props.theme.radius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease-in-out, slideIn 0.3s ease-in-out;
  color: ${props => props.theme.colors.text.primary};

  &:hover {
    background-color: ${props => props.isSelected ? props.theme.colors.accent.hover : props.theme.colors.surface.hover};
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
  gap: ${({ theme }) => theme.spacing.md};
`;

const Icon = styled.div`
  font-size: 48px;
  opacity: 0.5;
  color: ${({ theme }) => theme.colors.accent.primary};
`;

const Text = styled.p`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const SubText = styled.p`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.muted};
  margin: 0;
`;

export default SystemViewport;
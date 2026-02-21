import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeType } from '../../styles/theme';

interface SceneObject {
  id: string;
  name: string;
  type: string;
  aeid?: string;
  metaclass?: string;
  properties?: Record<string, any>;
  children?: SceneObject[];
}

interface SceneGraphProps {
  scene: SceneObject | null;
  onObjectSelect?: (object: SceneObject) => void;
  selectedObject?: SceneObject | null;
}

const SceneGraph: React.FC<SceneGraphProps> = ({ scene, onObjectSelect, selectedObject }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [objectProperties, setObjectProperties] = useState<Record<string, any>>({});

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

  const handlePropertyChange = (objectId: string, property: string, value: any) => {
    setObjectProperties(prev => ({
      ...prev,
      [objectId]: {
        ...prev[objectId],
        [property]: value
      }
    }));
  };

  const renderNode = (node: SceneObject, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = isNodeExpanded(node.id);
    const isSelected = selectedObject?.id === node.id;

    return (
      <NodeContainer key={node.id} level={level}>
        <NodeHeader
          onClick={() => onObjectSelect?.(node)}
          isSelected={isSelected}
        >
          {hasChildren && (
            <ExpandButton onClick={(e) => {
              e.stopPropagation();
              toggleNode(node.id);
            }}>
              {isExpanded ? '▼' : '▶'}
            </ExpandButton>
          )}
          {!hasChildren && <Spacer />}
          <NodeIcon>{getObjectIcon(node.type)}</NodeIcon>
          <NodeName>{node.name}</NodeName>
          <NodeType>{node.type}</NodeType>
        </NodeHeader>

        {hasChildren && isExpanded && (
          <NodeChildren>
            {node.children?.map(child => renderNode(child, level + 1))}
          </NodeChildren>
        )}

        {isSelected && (
          <SelectedObjectDetails>
            {node.aeid && (
              <AEIDTag>
                <AEIDLabel>{t('sceneGraph.properties.aeid')}</AEIDLabel>
                <AEIDValue>{node.aeid}</AEIDValue>
              </AEIDTag>
            )}

            {node.metaclass && (
              <MetaclassSection>
                <SectionTitle>Metaclasses</SectionTitle>
                <MetaclassTags>
                  <MetaclassTag>{node.metaclass}</MetaclassTag>
                  {/* 这里可以添加更多元类标签 */}
                  {node.type === 'cup' && (
                    <>
                      <MetaclassTag>Container</MetaclassTag>
                      <MetaclassTag>Grabbable</MetaclassTag>
                    </>
                  )}
                  {node.type === 'table' && (
                    <>
                      <MetaclassTag>Furniture</MetaclassTag>
                      <MetaclassTag>Static</MetaclassTag>
                    </>
                  )}
                </MetaclassTags>
              </MetaclassSection>
            )}

            {node.properties && Object.entries(node.properties).length > 0 && (
              <PropertiesSection>
                <SectionTitle>{t('sceneGraph.properties.properties')}</SectionTitle>
                {Object.entries(node.properties).map(([key, value]) => (
                  <PropertyControl key={key}>
                    <PropertyLabel>{key}</PropertyLabel>
                    <PropertySlider
                      type="range"
                      min="0"
                      max="100"
                      value={typeof value === 'number' ? value : 50}
                      onChange={(e) => handlePropertyChange(node.id, key, parseInt(e.target.value))}
                    />
                    <PropertyValueDisplay>{typeof value === 'number' ? value : String(value)}</PropertyValueDisplay>
                  </PropertyControl>
                ))}
              </PropertiesSection>
            )}
          </SelectedObjectDetails>
        )}
      </NodeContainer>
    );
  };

  const getObjectIcon = (type: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      scene: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      table: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7h-4V4c0-1.105-0.895-2-2-2h-4c-1.105 0-2 0.895-2 2v3H4c-1.105 0-2 0.895-2 2v10c0 1.105 0.895 2 2 2h16c1.105 0 2-0.895 2-2V9c0-1.105-0.895-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      chair: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7h-4V4c0-1.105-0.895-2-2-2h-4c-1.105 0-2 0.895-2 2v3H4c-1.105 0-2 0.895-2 2v10c0 1.105 0.895 2 2 2h16c1.105 0 2-0.895 2-2V9c0-1.105-0.895-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      cup: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8C17 10.2091 15.2091 12 13 12H5C2.79086 12 1 10.2091 1 8V6C1 3.79086 2.79086 2 5 2H13C15.2091 2 17 3.79086 17 6V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 8V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bottle: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      laptop: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      phone: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      book: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      picture: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      plant: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      window: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      door: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="2" width="18" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2v6M16 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    };

    return iconMap[type.toLowerCase()] || (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7h-4V4c0-1.105-0.895-2-2-2h-4c-1.105 0-2 0.895-2 2v3H4c-1.105 0-2 0.895-2 2v10c0 1.105 0.895 2 2 2h16c1.105 0 2-0.895 2-2V9c0-1.105-0.895-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <Container>
      <Title>{t('sceneGraph.title')}</Title>
      {scene ? (
        <TreeContainer>
          {renderNode(scene)}
        </TreeContainer>
      ) : (
        <EmptyState>
          <Icon>🌋</Icon>
          <Text>{t('sceneGraph.emptyState')}</Text>
          <SubText>{t('sceneGraph.emptySubtext')}</SubText>
        </EmptyState>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  height: 100%;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const TreeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 8px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Icon = styled.div`
  font-size: 48px;
  opacity: 0.5;
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

const NodeContainer = styled.div<{ level: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.level * 20}px;
`;

const NodeHeader = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.isSelected ? props.theme.colors.accent.muted : props.theme.colors.surface.muted};
  border: ${props => props.isSelected ? `1px solid ${props.theme.colors.accent.primary}` : `1px solid ${props.theme.colors.border}`};
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.isSelected ? props.theme.colors.accent.hover : props.theme.colors.surface.hover};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Spacer = styled.div`
  width: 12px;
`;

const NodeIcon = styled.div`
  font-size: 16px;
  width: 20px;
  opacity: 0.8;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const NodeName = styled.span`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

const NodeType = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const NodeChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

const SelectedObjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-left: 36px;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: fadeIn 0.3s ease-in-out, slideIn 0.3s ease-in-out;
`;

const AEIDTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.accent.muted};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.accent.border};
`;

const AEIDLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AEIDValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent.primary};
  font-family: 'Courier New', Courier, monospace;
  word-break: break-all;
`;

const MetaclassSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PropertiesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const MetaclassTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MetaclassTag = styled.div`
  background-color: ${({ theme }) => theme.colors.status.success.muted};
  color: ${({ theme }) => theme.colors.status.success.primary};
  border: 1px solid ${({ theme }) => theme.colors.status.success.border};
  border-radius: 12px;
  padding: 4px 10px;
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
`;

const PropertyControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PropertyLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PropertySlider = styled.input`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.surface.muted};
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background-color: ${({ theme }) => theme.colors.accent.primary};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background-color: ${({ theme }) => theme.colors.accent.primary};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const PropertyValueDisplay = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: 'Courier New', Courier, monospace;
  text-align: right;
`;

export default SceneGraph;
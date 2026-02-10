import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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
            {node.children.map(child => renderNode(child, level + 1))}
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

  const getObjectIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      scene: '🌍',
      table: '🪑',
      chair: '🪑',
      cup: '☕',
      bottle: '🍾',
      laptop: '💻',
      phone: '📱',
      book: '📚',
      picture: '🖼️',
      plant: '🌱',
      window: '🪟',
      door: '🚪',
    };

    return iconMap[type.toLowerCase()] || '📦';
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
  gap: 12px;
  padding: 40px;
  text-align: center;
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

const NodeContainer = styled.div<{ level: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.level * 20}px;
`;

const NodeHeader = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${props => props.isSelected ? 'rgba(0, 122, 204, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.isSelected ? '1px solid rgba(0, 122, 204, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(0, 122, 204, 0.3)' : 'rgba(255, 255, 255, 0.08)'};
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

const NodeIcon = styled.div`
  font-size: 16px;
  width: 20px;
  opacity: 0.8;
`;

const NodeName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
  flex: 1;
`;

const NodeType = styled.span`
  font-size: 12px;
  color: #888888;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  gap: 16px;
  margin-left: 36px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AEIDTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background-color: rgba(0, 122, 204, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(0, 122, 204, 0.2);
`;

const AEIDLabel = styled.span`
  font-size: 12px;
  color: #888888;
`;

const AEIDValue = styled.span`
  font-size: 13px;
  color: #007acc;
  font-family: 'Courier New', Courier, monospace;
  word-break: break-all;
`;

const MetaclassSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PropertiesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const MetaclassTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MetaclassTag = styled.div`
  background-color: rgba(102, 187, 106, 0.1);
  color: #66bb6a;
  border: 1px solid rgba(102, 187, 106, 0.2);
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 12px;
`;

const PropertyControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PropertyLabel = styled.span`
  font-size: 12px;
  color: #888888;
`;

const PropertySlider = styled.input`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background-color: #007acc;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background-color: #007acc;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const PropertyValueDisplay = styled.span`
  font-size: 12px;
  color: #e0e0e0;
  font-family: 'Courier New', Courier, monospace;
  text-align: right;
`;

export default SceneGraph;
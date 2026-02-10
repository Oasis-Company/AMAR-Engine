import React, { useState } from 'react';
import styled from 'styled-components';

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
}

const SceneGraph: React.FC<SceneGraphProps> = ({ scene, onObjectSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

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

  const renderNode = (node: SceneObject, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = isNodeExpanded(node.id);

    return (
      <NodeContainer key={node.id} level={level}>
        <NodeHeader
          onClick={() => onObjectSelect?.(node)}
          isSelected={false} // 这里可以添加选中状态逻辑
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

        {node.aeid && (
          <NodeProperties>
            <Property>
              <PropertyKey>AEID:</PropertyKey>
              <PropertyValue>{node.aeid}</PropertyValue>
            </Property>
          </NodeProperties>
        )}

        {node.metaclass && (
          <NodeProperties>
            <Property>
              <PropertyKey>Metaclass:</PropertyKey>
              <PropertyValue>{node.metaclass}</PropertyValue>
            </Property>
          </NodeProperties>
        )}

        {node.properties && Object.entries(node.properties).length > 0 && (
          <NodeProperties>
            {Object.entries(node.properties).map(([key, value]) => (
              <Property key={key}>
                <PropertyKey>{key}:</PropertyKey>
                <PropertyValue>{String(value)}</PropertyValue>
              </Property>
            ))}
          </NodeProperties>
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
      <Title>Scene Graph</Title>
      {scene ? (
        <TreeContainer>
          {renderNode(scene)}
        </TreeContainer>
      ) : (
        <EmptyState>
          <Icon>🌋</Icon>
          <Text>No scene data available</Text>
          <SubText>Upload media to generate scene graph</SubText>
        </EmptyState>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 8px;
  height: 100%;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const TreeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #252526;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #424242;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #4e4e4e;
  }
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
`;

const Text = styled.p`
  font-size: 16px;
  color: #cccccc;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #888888;
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
  background-color: ${props => props.isSelected ? '#0e639c' : '#252526'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.isSelected ? '#1177bb' : '#2d2d30'};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
  }
`;

const Spacer = styled.div`
  width: 12px;
`;

const NodeIcon = styled.div`
  font-size: 16px;
  width: 20px;
`;

const NodeName = styled.span`
  font-size: 14px;
  color: #ffffff;
  flex: 1;
`;

const NodeType = styled.span`
  font-size: 12px;
  color: #888888;
  background-color: #3e3e42;
  padding: 2px 6px;
  border-radius: 10px;
`;

const NodeChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

const NodeProperties = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 36px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const Property = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px;
  background-color: #2d2d30;
  border-radius: 3px;
`;

const PropertyKey = styled.span`
  font-size: 12px;
  color: #888888;
  min-width: 80px;
`;

const PropertyValue = styled.span`
  font-size: 12px;
  color: #cccccc;
  font-family: 'Courier New', Courier, monospace;
  word-break: break-all;
`;

export default SceneGraph;
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

type StatusType = 'idle' | 'processing' | 'success' | 'error';

interface StatusObject {
  id: string;
  name: string;
  type: string;
  aeid?: string;
  metaclass?: string;
  properties?: Record<string, any>;
  children?: StatusObject[];
}

interface StatusBarProps {
  status: StatusType;
  message: string;
  progress?: number; // 0-100
  error?: string;
  scene?: StatusObject | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, message, progress, error, scene }) => {
  const { t } = useTranslation();

  const getStatusIcon = (): string => {
    switch (status) {
      case 'idle':
        return '📋';
      case 'processing':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📋';
    }
  };

  const getStatusColor = (): string => {
    switch (status) {
      case 'idle':
        return '#e0e0e0';
      case 'processing':
        return '#007acc';
      case 'success':
        return '#66bb6a';
      case 'error':
        return '#f48771';
      default:
        return '#e0e0e0';
    }
  };

  // 计算场景中的物体数量
  const getObjectCount = (): number => {
    const countObjects = (obj: StatusObject): number => {
      let count = 1;
      if (obj.children && obj.children.length > 0) {
        count += obj.children.reduce((acc, child) => acc + countObjects(child), 0);
      }
      return count;
    };
    return scene ? countObjects(scene) - 1 : 0; // 减去场景本身
  };

  return (
    <Container className="acrylic border">
      <StatusSection>
        <StatusIcon style={{ color: getStatusColor() }}>
          {getStatusIcon()}
        </StatusIcon>
        <StatusMessage>{message}</StatusMessage>
      </StatusSection>

      {progress !== undefined && (
        <ProgressSection>
          <ProgressBarContainer className="border">
            <ProgressBar fill={progress} />
          </ProgressBarContainer>
          <ProgressText>{progress}%</ProgressText>
        </ProgressSection>
      )}

      {error && status === 'error' && (
        <ErrorSection className="border">
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorSection>
      )}

      <SystemSection>
        <SystemInfo>AME v1.0.0</SystemInfo>
        <SystemInfo>Objects: {getObjectCount()}</SystemInfo>
        <SystemInfo>Ready</SystemInfo>
      </SystemSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 16px;
  color: #e0e0e0;
  font-size: 12px;
  height: 48px;
  border-radius: 8px 8px 0 0;
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const StatusIcon = styled.div`
  font-size: 14px;
`;

const StatusMessage = styled.span`
  color: #e0e0e0;
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
`;

const ProgressBarContainer = styled.div`
  width: 150px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ fill: number }>`
  width: ${props => props.fill}%;
  height: 100%;
  background-color: #007acc;
  border-radius: 3px;
  transition: width 0.3s ease-in-out;
`;

const ProgressText = styled.span`
  color: #e0e0e0;
  min-width: 35px;
  text-align: right;
`;

const ErrorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  color: #f48771;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(244, 135, 113, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 14px;
`;

const ErrorMessage = styled.span`
  color: #f48771;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SystemSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SystemInfo = styled.span`
  color: #888888;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
`;

export default StatusBar;
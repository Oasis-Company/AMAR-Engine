import React from 'react';
import styled from 'styled-components';

type StatusType = 'idle' | 'processing' | 'success' | 'error';

interface StatusBarProps {
  status: StatusType;
  message: string;
  progress?: number; // 0-100
  error?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, message, progress, error }) => {
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
        return '#cccccc';
      case 'processing':
        return '#007acc';
      case 'success':
        return '#6a9955';
      case 'error':
        return '#f48771';
      default:
        return '#cccccc';
    }
  };

  return (
    <Container>
      <StatusSection>
        <StatusIcon style={{ color: getStatusColor() }}>
          {getStatusIcon()}
        </StatusIcon>
        <StatusMessage>{message}</StatusMessage>
      </StatusSection>

      {progress !== undefined && (
        <ProgressSection>
          <ProgressBarContainer>
            <ProgressBar fill={progress} />
          </ProgressBarContainer>
          <ProgressText>{progress}%</ProgressText>
        </ProgressSection>
      )}

      {error && status === 'error' && (
        <ErrorSection>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorSection>
      )}

      <SystemSection>
        <SystemInfo>AME v1.0.0</SystemInfo>
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
  background-color: #1e1e1e;
  border-top: 1px solid #3e3e42;
  color: #cccccc;
  font-size: 12px;
  height: 40px;
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
  color: #cccccc;
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
  background-color: #3e3e42;
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
  color: #cccccc;
  min-width: 35px;
  text-align: right;
`;

const ErrorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  color: #f48771;
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
`;

export default StatusBar;
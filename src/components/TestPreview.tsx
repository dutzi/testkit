import React from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Test, TestStatus } from '../types';
import TestStatusBar from './TestStatusBar';

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const FlexRow = styled.div`
  display: flex;
`;

const Steps = styled.div``;

const TestName = styled.div`
  flex: 1;
`;

const Step = styled.div`
  display: flex;
  margin: 12px 0px;
`;

const markdownOverrides = css`
  ol {
    margin: 0px;
    padding: 0px 20px;
  }

  p {
    margin: 0px;
  }

  blockquote {
    margin-inline-start: 20px;
  }
`;

const Description = styled.div`
  flex: 1.4;
  margin-right: 16px;
  background: #e3e3e3;
  border-radius: 4px;
  padding: 12px;

  ${markdownOverrides}
`;

const Result = styled.div`
  flex: 1;
  border-radius: 4px;
  background: #e3e3e3;
  padding: 12px;

  ${markdownOverrides}
`;

const TestPreview = ({ test, status }: { test: Test; status: TestStatus }) => {
  return (
    <Wrapper>
      <FlexRow>
        <TestName>
          #{test.id} {test.name}
        </TestName>
        <TestStatusBar test={test} status={status} />
      </FlexRow>
      <Steps>
        {test.steps.map(step => (
          <Step>
            <Description>
              <ReactMarkdown source={step.description} />
            </Description>
            <Result>
              <ReactMarkdown source={step.result} />
            </Result>
          </Step>
        ))}
      </Steps>
    </Wrapper>
  );
};

export default TestPreview;

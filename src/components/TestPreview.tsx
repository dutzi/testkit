import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Test, TestStatus } from '../types';
import TestStatusBar from './TestStatusBar';
import { markdownOverrides } from '../styles';

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const Steps = styled.div``;

const TestName = styled.div`
  flex: 1;
  font-weight: 600;
`;

const Step = styled.div`
  margin: 12px 0px;
`;

const HBox = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const Description = styled.div`
  flex: 1.4;
  margin-right: 16px;
  background: #ececec;
  border-radius: 4px;
  padding: 12px;

  ${markdownOverrides}
`;

const Result = styled.div`
  flex: 1;
  border-radius: 4px;
  background: #ececec;
  padding: 12px;

  ${markdownOverrides}
`;

const Title = styled.div`
  margin-bottom: 12px;
`;

const TestStatusMessage = styled.div`
  border-radius: 4px;
  background: white;
  padding: 12px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  ${markdownOverrides}
`;

const TestPreview = ({ test, status }: { test: Test; status?: TestStatus }) => {
  console.log({ status });
  return (
    <Wrapper>
      <FlexRow>
        <TestName>
          {test.name} (#{test.id})
        </TestName>
        <TestStatusBar test={test} status={status} />
      </FlexRow>
      <Steps>
        <base target="_blank" />
        {test.steps.map(step => (
          <Step>
            <HBox>
              <Description>
                <ReactMarkdown source={step.description} />
              </Description>
              <Result>
                <ReactMarkdown source={step.result} />
              </Result>
            </HBox>
            {status && status[step.id] && (
              <React.Fragment>
                <Title>Test Message</Title>
                <TestStatusMessage>
                  <ReactMarkdown source={status[step.id].message} />
                </TestStatusMessage>
              </React.Fragment>
            )}
          </Step>
        ))}
      </Steps>
    </Wrapper>
  );
};

export default TestPreview;

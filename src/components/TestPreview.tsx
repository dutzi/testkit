import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Test, TestStatus } from '../types';
import TestProgressBar from './TestProgressBar';
import MarkdownViewer from './MarkdownViewer';

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
  word-break: break-word;
`;

const Result = styled.div`
  flex: 1;
  border-radius: 4px;
  background: #ececec;
  padding: 12px;
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
`;

const TestPreview = ({
  test,
  status,
  showProgress,
}: {
  test: Test;
  status?: TestStatus;
  showProgress: boolean;
}) => {
  return (
    <Wrapper>
      <FlexRow>
        <TestName>
          {test.name} (#{test.id})
        </TestName>
        {showProgress && <TestProgressBar test={test} status={status} />}
      </FlexRow>
      <Steps>
        <base target="_blank" />
        {test.steps.map(step => {
          const message = _.get(status, `[${step.id}].message`);
          return (
            <Step key={step.id}>
              <HBox>
                <Description>
                  <MarkdownViewer
                    label="Description"
                    source={step.description}
                  />
                </Description>
                <Result>
                  <MarkdownViewer
                    label="Expected result"
                    source={step.result}
                  />
                </Result>
              </HBox>
              {message && (
                <React.Fragment>
                  <Title>Test Message</Title>
                  <TestStatusMessage>
                    <MarkdownViewer label="Message" source={message} />
                  </TestStatusMessage>
                </React.Fragment>
              )}
            </Step>
          );
        })}
      </Steps>
    </Wrapper>
  );
};

export default TestPreview;

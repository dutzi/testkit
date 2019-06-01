import React from 'react';
import styled from 'styled-components';
import { Step as IStep } from '../../types';
import { markdownOverrides, MarginV, MarginH } from '../../styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import _ from 'lodash';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MarkdownEditor from '../../components/MarkdownEditor';
import MarkdownViewer from '../../components/MarkdownViewer';
import { useTestRunner } from './hooks';

const Wrapper = styled.div`
  padding: 24px;
  overflow: auto;
`;

const MaxWidth = styled.div`
  max-width: 1024px;
`;

const Title = styled.div`
  display: flex;
  font-weight: 600;
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
`;

const NumTests = styled.div`
  padding: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
`;

const Steps = styled.div``;

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

  ${markdownOverrides}
`;

const Result = styled.div`
  flex: 1;
  border-radius: 4px;
  background: #ececec;
  padding: 12px;
  word-break: break-word;

  ${markdownOverrides}
`;

const TestStatusMessage = styled.div`
  border-radius: 4px;
  background: white;
  overflow: hidden;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  ${markdownOverrides}
`;

const StepActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 24px 0px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TestRunner = ({
  testSetId,
  testId,
  onNext,
  onPrev,
  testIndex,
  numTests,
}: {
  testSetId: string;
  testId: string;
  onNext: (e: React.MouseEvent | null) => void;
  onPrev: (e: React.MouseEvent | null) => void;
  testIndex: number;
  numTests: number;
}) => {
  const { updateStepStatus, test, testSet } = useTestRunner(testSetId, testId);

  if (!test) {
    return (
      <Wrapper>
        <MaxWidth>
          <div>
            This test does not exist{' '}
            <span role="img" aria-label="thinking face">
              🤔
            </span>
          </div>
          <MarginH />
          {renderActions()}
        </MaxWidth>
      </Wrapper>
    );
  }

  function handleStatusChange(step: IStep, e: any) {
    updateStepStatus(step, {
      status: e.target.value,
    });
  }

  function handleMessageChange(step: IStep, value: string) {
    updateStepStatus(step, {
      message: value,
    });
  }

  function handleSubmit() {
    onNext(null);
  }

  function renderActions() {
    return (
      <Actions>
        {testIndex > 0 && (
          <Button onClick={onPrev} variant="text" color="default">
            Previous Test
          </Button>
        )}
        <MarginV margin="12px" />
        <Button onClick={onNext} variant="contained" color="primary">
          {numTests - 1 === testIndex ? (
            'Done'
          ) : (
            <React.Fragment>
              Next Test
              <MarginV margin="6px" />
              <ChevronRightIcon />
              <MarginV margin="-6px" />
            </React.Fragment>
          )}
        </Button>
      </Actions>
    );
  }

  return (
    <Wrapper>
      <MaxWidth>
        <Title>
          {test.name} (#{test.id})
          <NumTests>
            {testIndex + 1} of {numTests}
          </NumTests>
        </Title>
        <Steps>
          <base target="_blank" />
          {test.steps.map(step => (
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
              <React.Fragment>
                <Title>Actual Results</Title>
                <TestStatusMessage>
                  <MarkdownEditor
                    minHeight="120px"
                    onChange={handleMessageChange.bind(null, step)}
                    placeholder="Description"
                    showBorder={false}
                    initialValue={_.get(
                      testSet,
                      `status[${testId}][${step.id}].message`,
                      '',
                    )}
                    onSubmit={handleSubmit}
                  />
                </TestStatusMessage>
              </React.Fragment>
              <StepActions>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="position"
                    name={`stepStatus_${step.id}`}
                    value={_.get(
                      testSet,
                      `status[${testId}][${step.id}].status`,
                      '',
                    )}
                    onChange={handleStatusChange.bind(null, step)}
                    row
                  >
                    <FormControlLabel
                      value="passed"
                      control={<Radio color="primary" />}
                      label="Pass"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="failed"
                      control={<Radio color="secondary" />}
                      label="Fail"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="skipped"
                      control={<Radio color="default" />}
                      label="Skip"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </StepActions>
            </Step>
          ))}
        </Steps>
        {renderActions()}
      </MaxWidth>
    </Wrapper>
  );
};

export default TestRunner;

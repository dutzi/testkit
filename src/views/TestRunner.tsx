import React, { useContext } from 'react';
import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { getDocById } from '../data-utils';
import produce from 'immer';
import { Test, Step as IStep, TestSet } from '../types';
import ReactMarkdown from 'react-markdown';
import { markdownOverrides, MarginV } from '../styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import _ from 'lodash';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MarkdownEditor from '../components/MarkdownEditor';
import { WorkspaceContext } from './Main';

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
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  testIndex: number;
  numTests: number;
}) => {
  const workspace = useContext(WorkspaceContext);

  const { value: testSetsCollection } = useCollection(
    firestore.collection(`workspaces/${workspace}/test-sets`),
  );

  const { value: testsCollection } = useCollection(
    firestore.collection(`workspaces/${workspace}/tests`),
  );

  if (!testSetsCollection || !testsCollection) {
    return null;
  }

  const testSetDoc = getDocById(testSetId, testSetsCollection!.docs);
  const testDoc = getDocById(testId, testsCollection!.docs);

  if (!testDoc) {
    return null;
  }

  if (!testSetDoc) {
    return null;
  }

  const test: Test = testDoc.data() as Test;
  const testSet: TestSet = testSetDoc!.data() as TestSet;

  function updateStepStatus(step: IStep, value) {
    if (testSetDoc) {
      var testSetRef = firestore
        .collection(`workspaces/${workspace}/test-sets`)
        .doc(testSetDoc.id);
      if (testSetRef) {
        const testSet = testSetDoc.data();

        const nextState = produce(testSet, draftState => {
          draftState.status[testId] = draftState.status[testId] || {};
          draftState.status[testId][step.id] = {
            ...draftState.status[testId][step.id],
            ...value,
          };
        });

        testSetRef.update(nextState);
      }
    }
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
                  <ReactMarkdown source={step.description} />
                </Description>
                <Result>
                  <ReactMarkdown source={step.result} />
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
      </MaxWidth>
    </Wrapper>
  );
};

export default TestRunner;

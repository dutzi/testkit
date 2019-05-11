import React from 'react';
import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { getDocById } from '../data-utils';
import { Test, Step as IStep, TestSet } from '../types';
import ReactMarkdown from 'react-markdown';
import { markdownOverrides, MarginV } from '../styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import _ from 'lodash';

const Wrapper = styled.div`
  padding: 24px;
  overflow: auto;
`;

const MaxWidth = styled.div`
  max-width: 1024px;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 12px;
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
  padding: 12px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  ${markdownOverrides}
`;

const StepActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 24px 0px;
`;

const TestRunner = ({
  testSetId,
  testId,
}: {
  testSetId: string;
  testId: string;
}) => {
  const { value: testSetsCollection } = useCollection(
    firestore.collection('test-sets'),
  );

  const { value: testsCollection } = useCollection(
    firestore.collection('tests'),
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

  // function handlePass(step: IStep) {}
  function handleChange(step: IStep, e: any) {
    if (testSetDoc) {
      var testSetRef = firestore.collection('test-sets').doc(testSetDoc.id);
      if (testSetRef) {
        const testSet = testSetDoc.data();
        testSetRef.update({
          ...testSet,
          status: {
            ...testSet.status,
            [testId]: {
              ...testSet.status[testId],
              [step.id]: {
                ...testSet.status[testId][step.id],
                status: e.target.value,
              },
            },
          },
        });
      }
    }
  }

  return (
    <Wrapper>
      <MaxWidth>
        <Title>
          {test.name} ({test.id})
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
                <Title>Test Message</Title>
                <TestStatusMessage>
                  <ReactMarkdown source={'asda'} />
                </TestStatusMessage>
              </React.Fragment>
              <StepActions>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="position"
                    name="position"
                    value={_.get(
                      testSet,
                      `status[${testId}][${step.id}].status`,
                      '',
                    )}
                    onChange={handleChange.bind(null, step)}
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

                {/* <Button
                  onClick={handlePass.bind(null, step)}
                  variant="text"
                  color="default"
                >
                  Skip
                </Button>
                <MarginV margin="12px" />
                <Button
                  onClick={handlePass.bind(null, step)}
                  variant="contained"
                  color="secondary"
                >
                  Fail
                </Button>
                <MarginV margin="12px" />
                <Button
                  onClick={handlePass.bind(null, step)}
                  variant="contained"
                  color="primary"
                >
                  Pass
                </Button> */}
              </StepActions>
            </Step>
          ))}
        </Steps>
      </MaxWidth>
    </Wrapper>
  );
};

export default TestRunner;

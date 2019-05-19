import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { TestSet, Test, Step, StepStatus } from '../types';
import { firestore } from '../firebase';
import _ from 'lodash';
import { Tooltip } from '@material-ui/core';
import {
  GlobalUserContext,
  TestsCollectionContext,
} from '../views/ContextProviders';

const Wrapper = styled.div`
  display: flex;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
`;

const border = css`
  margin-right: 2px

  &:last-child {
    margin-right: 0px;
  }
`;

const Passed = styled.div`
  background-color: #66bb66;
  flex: 1;

  ${border}
`;
const Failed = styled.div`
  background-color: #ee4444;
  flex: 1;
  ${border}
`;
const NoRun = styled.div`
  background-color: #d1d1d1;
  flex: 1;
  ${border}
`;

const TestSetProgressBar = ({ testSet }: { testSet: TestSet }) => {
  const globalUser = useContext(GlobalUserContext);
  const testsCollection = useContext(TestsCollectionContext);
  const tests = testsCollection!.docs.map(doc => doc.data());

  function getTestById(id: string, tests: Test[]): Test | undefined {
    if (tests) {
      return tests.find(test => test.id === id);
    }
  }

  function getTestStatus(testSet: TestSet) {
    let numPassed = 0;
    let numFailed = 0;
    let numNoRun = 0;
    let aggregatedStatus: StepStatus[] = [];

    testSet.tests.forEach(testId => {
      const test = getTestById(testId, tests as Test[]);
      if (test) {
        let testAggregatedStatus = test.steps.map((step: Step) => {
          const status: StepStatus = _.get(
            testSet,
            `status[${testId}][${step.id}].status`,
          );
          if (status === 'passed') numPassed++;
          else if (status === 'failed') numFailed++;
          else numNoRun++;
          return status || 'skipped';
        });
        aggregatedStatus = aggregatedStatus.concat(testAggregatedStatus);
      }
    });

    return { aggregatedStatus, numPassed, numFailed, numNoRun };
  }

  function renderStatusBar(status: StepStatus, index: number) {
    if (status === 'passed') {
      return <Passed key={index} />;
    } else if (status === 'failed') {
      return <Failed key={index} />;
    } else if (status === 'skipped') {
      return <NoRun key={index} />;
    }
  }

  function getTooltipTitle(numPassed, numFailed, numNoRun) {
    return `Passed: ${numPassed} – Failed: ${numFailed} – Skipped: ${numNoRun}`;
  }

  let { aggregatedStatus, numPassed, numFailed, numNoRun } = getTestStatus(
    testSet,
  );

  return (
    <Tooltip title={getTooltipTitle(numPassed, numFailed, numNoRun)}>
      <Wrapper>
        {aggregatedStatus.map((status, index) =>
          renderStatusBar(status, index),
        )}
      </Wrapper>
    </Tooltip>
  );
};

export default TestSetProgressBar;

import React from 'react';
import styled, { css } from 'styled-components';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Test, StepStatus, TestStatus } from '../types';
import { firestore } from '../firebase';
import _ from 'lodash';
import { Tooltip } from '@material-ui/core';

const Wrapper = styled.div`
  display: flex;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  width: 150px;
  height: 10px;
`;

const border = css`
  margin-right: 4px

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

const TestProgressBar = ({
  test,
  status,
}: {
  test: Test;
  status?: TestStatus;
}) => {
  function getTestStatus(test: Test) {
    let numPassed = 0;
    let numFailed = 0;
    let numNoRun = 0;
    let aggregatedStatus: StepStatus[] = [];

    test.steps.forEach(step => {
      const stepStatus = _.get(status, `[${step.id}].status`, 'skipped');
      if (stepStatus === 'passed') numPassed++;
      else if (stepStatus === 'failed') numFailed++;
      else numNoRun++;
      aggregatedStatus.push(stepStatus);
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
    test,
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

export default TestProgressBar;

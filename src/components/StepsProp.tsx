import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import uuidv1 from 'uuid/v1';
import TestStep from './TestStep';

const Wrapper = styled.div``;

const TopLabel = styled.div`
  margin-bottom: 13px;
`;

const Label = styled.div`
  text-transform: uppercase;
  color: #676d98;
  margin-bottom: 13px;
`;

const AddStepContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 13px;
  margin-top: 13px;
`;

interface Step {
  id: string;
}

const StepsProp = () => {
  const [steps, setSteps] = useState<Step[]>([{ id: uuidv1() }]);

  const handleRemoveStep = (index: number) => {
    setSteps([...steps.slice(0, index), ...steps.slice(index + 1)]);
  };

  const handleDuplicateStep = (index: number) => {
    setSteps([
      ...steps.slice(0, index),
      { ...steps[index], id: uuidv1() },
      ...steps.slice(index),
    ]);
  };

  const handleAddStep = (index: number) => {
    setSteps([
      ...steps.slice(0, index),
      { id: uuidv1() },
      ...steps.slice(index),
    ]);
  };
  return (
    <Wrapper>
      {steps.map((step, index) => (
        <TestStep
          key={step.id}
          onRemove={handleRemoveStep.bind(null, index)}
          onDuplicate={handleDuplicateStep.bind(null, index)}
          onAdd={handleAddStep.bind(null, index)}
        />
      ))}
    </Wrapper>
  );
};

export default StepsProp;

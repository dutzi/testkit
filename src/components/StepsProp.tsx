import React, { useState } from 'react';
import styled from 'styled-components';
import IconButton from './IconButton';
import TestStep from './TestStep';
import uuidv1 from 'uuid/v1';

const Wrapper = styled.div``;

const TopLabel = styled.div`
  text-transform: uppercase;
  color: var(--text-color);
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
`;

interface Step {
  id: string;
}

const StepsProp = () => {
  const [steps, setSteps] = useState<Step[]>([{ id: uuidv1() }]);
  const handleAddStep = () => {
    setSteps([...steps, { id: uuidv1() }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps([...steps.slice(0, index), ...steps.slice(index + 1)]);
  };
  return (
    <Wrapper>
      <TopLabel>Steps</TopLabel>
      {steps.map((step, index) => (
        <TestStep key={step.id} onRemove={handleRemoveStep.bind(null, index)} />
      ))}
      <AddStepContainer>
        <IconButton onClick={handleAddStep} label="Add A Step" icon="Plus" />
      </AddStepContainer>
    </Wrapper>
  );
};

export default StepsProp;

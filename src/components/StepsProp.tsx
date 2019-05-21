import React from 'react';
import styled from 'styled-components';
import uuidv1 from 'uuid/v1';
import TestStep from './TestStep';
import { Step } from '../types';

const Wrapper = styled.div``;

const StepsProp = ({
  steps,
  onChange,
}: {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}) => {
  function createStep(step?: Step) {
    return { id: uuidv1(), description: '', result: '', ...step };
  }

  function handleRemoveStep(index: number) {
    onChange([...steps.slice(0, index), ...steps.slice(index + 1)]);
  }

  function handleDuplicateStep(index: number) {
    onChange([
      ...steps.slice(0, index),
      { ...steps[index], id: uuidv1() },
      ...steps.slice(index),
    ]);
  }

  function handleAddStep(index: number) {
    onChange([
      ...steps.slice(0, index + 1),
      createStep(),
      ...steps.slice(index + 1),
    ]);
  }

  function handleChange(index: number, value: Step) {
    onChange([...steps.slice(0, index), value, ...steps.slice(index + 1)]);
  }

  console.log('[stepsprop]', steps);
  return (
    <Wrapper>
      {steps.map((step, index) => (
        <TestStep
          key={step.id}
          step={step}
          index={index}
          onRemove={handleRemoveStep.bind(null, index)}
          onDuplicate={handleDuplicateStep.bind(null, index)}
          onAdd={handleAddStep.bind(null, index)}
          onChange={handleChange.bind(null, index)}
          allowRemove={steps.length > 1}
        />
      ))}
    </Wrapper>
  );
};

export default StepsProp;

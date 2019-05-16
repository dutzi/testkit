import React from 'react';
import styled from 'styled-components';
import uuidv1 from 'uuid/v1';
import TestStep from './TestStep';
import { Step } from '../types';

const Wrapper = styled.div``;

class StepsProp extends React.Component<{
  steps: Step[];
  onChange: (steps: Step[]) => void;
}> {
  createStep(step?: Step) {
    return { id: uuidv1(), description: '', result: '', ...step };
  }

  handleRemoveStep(index: number) {
    const { steps } = this.props;
    this.props.onChange([...steps.slice(0, index), ...steps.slice(index + 1)]);
  }

  handleDuplicateStep(index: number) {
    const { steps } = this.props;

    this.props.onChange([
      ...steps.slice(0, index),
      { ...steps[index], id: uuidv1() },
      ...steps.slice(index),
    ]);
  }

  handleAddStep(index: number) {
    const { steps } = this.props;

    this.props.onChange([
      ...steps.slice(0, index + 1),
      this.createStep(),
      ...steps.slice(index + 1),
    ]);
  }

  onChange(index: number, value: Step) {
    this.props.onChange([
      ...this.props.steps.slice(0, index),
      value,
      ...this.props.steps.slice(index + 1),
    ]);
  }

  render() {
    return (
      <Wrapper>
        {this.props.steps.map((step, index) => (
          <TestStep
            key={step.id}
            step={step}
            index={index}
            onRemove={this.handleRemoveStep.bind(this, index)}
            onDuplicate={this.handleDuplicateStep.bind(this, index)}
            onAdd={this.handleAddStep.bind(this, index)}
            onChange={this.onChange.bind(this, index)}
            allowRemove={this.props.steps.length > 1}
          />
        ))}
      </Wrapper>
    );
  }
}

export default StepsProp;

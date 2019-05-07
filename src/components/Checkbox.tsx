import React from 'react';
import styled from 'styled-components';
import { Check } from 'react-feather';

const VisualCheckbox = styled.div`
  width: 27px;
  height: 27px;
  background-color: var(--background-checkbox);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.label`
  margin-left: 6px;
  display: inline-block;

  input {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;

    &:checked + ${VisualCheckbox} {
    }

    &:focus + ${VisualCheckbox} {
      border: 1px solid var(--input-border-color-focused);
      box-shadow: 0px 0px 0px 3px #172e51;
    }
  }
`;

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <Wrapper>
      <input
        type="checkbox"
        className="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <VisualCheckbox>{checked && <Check color="#554DF5" />}</VisualCheckbox>
    </Wrapper>
  );
};

export default Checkbox;

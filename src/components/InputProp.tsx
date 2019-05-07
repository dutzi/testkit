import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.div`
  text-transform: uppercase;
  color: var(--text-color);
  margin-bottom: 13px;
`;

const Input = styled.input`
  width: calc(100% - 22px);
  background-color: var(--input-background-color);
  border-radius: 5px;
  color: white;
  outline: none;
  border: 1px solid var(--input-border-color);
  font-size: 16px;
  padding: 10px;

  &:focus {
    border: 1px solid var(--input-border-color-focused);
    box-shadow: 0px 0px 0px 3px #172e51;
  }
`;

const InputProp = ({
  label,
  focusOnMount,
}: {
  label: string;
  focusOnMount?: boolean;
}) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount && input.current) {
      input.current.focus();
    }
  }, []);

  return (
    <Wrapper>
      <Label>{label}</Label>
      <Input ref={input} />
    </Wrapper>
  );
};

export default InputProp;

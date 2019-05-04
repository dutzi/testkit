import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const Wrapper = styled.div`
  margin-bottom: 15px;
`;

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const Label = styled.div`
  text-transform: uppercase;
  color: var(--text-color);
  margin-bottom: 13px;
`;

const customStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--input-background-color)',
    borderColor: 'var(--input-border-color)',
    padding: '1px',
    '&:hover': { borderColor: 'var(--input-border-color)' },
    // '&:focus': { boxShadow: '0px 0px 0px 3px #172e51' },
  }),
  indicatorSeparator: (style: any) => ({
    ...style,
    backgroundColor: 'var(--input-border-color)',
  }),
  dropdownIndicator: (style: any) => ({
    ...style,
    color: 'var(--input-border-color)',
  }),
  input: (style: any) => ({
    ...style,
    color: 'white',
  }),
  singleValue: (style: any) => ({
    ...style,
    color: 'white',
  }),
  option: (styles: any) => {
    return {
      ...styles,
    };
  },
};

const SelectProp = ({ label }: { label: string }) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Select styles={customStyles} options={options} />
    </Wrapper>
  );
};

export default SelectProp;

import React from 'react';
import styled from 'styled-components';
import InputProp from '../components/InputProp';
import SelectProp from '../components/SelectProp';
import StepsProp from '../components/StepsProp';
import BigButton from '../components/BigButton';

const Wrapper = styled.div`
  width: 700px;
  padding: 15px;
`;

const TypeWrapper = styled.div`
  display: flex;
  width: 500px;
`;

const SelectPropWrapper = styled.div`
  flex: 1;
  margin-right: 15px;

  &:last-child {
    margin-right: 0px;
  }
`;

const SaveChangesContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NewTestView = () => {
  const handleSaveChanges = () => {};
  return (
    <Wrapper>
      <InputProp label="Name" />
      <TypeWrapper>
        <SelectPropWrapper>
          <SelectProp label="Component" />
        </SelectPropWrapper>
        <SelectPropWrapper>
          <SelectProp label="Sub Component" />
        </SelectPropWrapper>
      </TypeWrapper>
      <StepsProp />
      <SaveChangesContainer>
        <BigButton label="Save Changes" onClick={handleSaveChanges} />
      </SaveChangesContainer>
    </Wrapper>
  );
};

export default NewTestView;

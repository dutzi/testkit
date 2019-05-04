import React from 'react';
import styled from 'styled-components';
import * as Icons from 'react-feather';

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #e3e5f7;
`;

const IconButton = ({ label, icon }: { label: string; icon: string }) => {
  const Icon = Icons[icon];
  return (
    <Wrapper href="#">
      <Icon color="#554DF5" />
      {label}
    </Wrapper>
  );
};

export default IconButton;

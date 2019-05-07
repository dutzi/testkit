import React from 'react';
import styled from 'styled-components';
import * as Icons from 'react-feather';

const Wrapper = styled.a`
  padding: 15px;
  color: #727694;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`;

const IconWrapper = styled.div`
  margin-right: 6px;
`;

const ToolbarButton = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: any;
  onClick: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const Icon = Icons[icon];

  return (
    <Wrapper href="#" onClick={handleClick}>
      <IconWrapper>
        <Icon color="#554DF5" />
      </IconWrapper>
      {label}
    </Wrapper>
  );
};

export default ToolbarButton;

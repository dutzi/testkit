import React from 'react';
import styled from 'styled-components';
import * as Icons from 'react-feather';

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #e3e5f7;
`;

const IconWrapper = styled.div`
  margin-right: 6px;
`;

const IconButton = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) => {
  const Icon = Icons[icon];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Wrapper onClick={handleClick} href="#">
      <IconWrapper>
        <Icon color="#554DF5" />
      </IconWrapper>
      {label}
    </Wrapper>
  );
};

export default IconButton;

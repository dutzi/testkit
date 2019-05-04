import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.a`
  background-color: var(--background-bright);
  padding: 14px 23px;
  font-weight: 600;
  border-radius: 5px;
  color: white;
  text-decoration: none;
`;

const BigButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };
  return (
    <Wrapper href="#" onClick={handleClick}>
      {label}
    </Wrapper>
  );
};

export default BigButton;

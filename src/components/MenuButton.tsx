import React from 'react';
import styled from 'styled-components';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { MarginV } from '../styles';
import media from '../media-queries';
import { useGlobalState } from '../state';

const Wrapper = styled.div`
  ${media.desktop`
    display: none;
  `}
`;

const MenuButton = () => {
  const [, dispatch] = useGlobalState();

  function handleClick() {
    dispatch({ type: 'show-sidebar' });
  }

  return (
    <Wrapper>
      <IconButton onClick={handleClick}>
        <MenuIcon htmlColor="white" />
      </IconButton>
      <MarginV margin="48px" />
    </Wrapper>
  );
};

export default MenuButton;

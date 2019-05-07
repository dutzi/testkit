import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  background-color: var(--background-light);
  box-shadow: 0px 10px 20px black;
  width: 770px;
  margin: 80px auto;
  border-radius: 3px;
  border: 1px solid var(--input-border-color);
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: #00000066;
  overflow: auto;
  z-index: 100;
`;

const Modal = ({
  children,
  onClose,
}: {
  children: any;
  onClose: () => void;
}) => {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (wrapper.current) {
        const dimensions = wrapper.current.getBoundingClientRect();
        // wrapper.current.style.left =
        //   window.innerWidth / 2 - dimensions.width / 2 + 'px';
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();
  });

  const handleClose = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <React.Fragment>
      <Backdrop onClick={handleClose}>
        <Wrapper ref={wrapper}>{children}</Wrapper>
      </Backdrop>
    </React.Fragment>
  );
};

export default Modal;

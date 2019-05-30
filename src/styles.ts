import styled, { css } from 'styled-components';

export const markdownOverrides = css`
  ol {
    margin: 0px;
    padding: 0px 20px;
  }

  p {
    margin: 0px;
  }

  blockquote {
    margin-inline-start: 20px;
  }
`;

export const MarginH = styled.div`
  margin-bottom: ${(p: { margin?: string }) => p.margin || '24px'};
`;

export const MarginV = styled.div`
  margin-right: ${(p: { margin?: string }) => p.margin || '24px'};
`;

export const TableLink = styled.a`
  text-decoration: none;
  color: #000000de;
  outline: none;
  padding: 16px 0px;
  position: relative;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    :before {
      content: '';
      position: absolute;
      top: 16px;
      left: 0px;
      right: 0px;
      bottom: 16px;
      background: #00000022;
      border-radius: 4px;
      margin: -4px;
    }
  }
`;

export const Toolbar = styled.div`
  display: flex;
  background-color: var(--background-blue);
  padding: 10px;
`;

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

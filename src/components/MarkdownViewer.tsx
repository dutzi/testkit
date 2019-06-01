import React from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { markdownOverrides } from '../styles';

const Wrapper = styled.div`
  ${(p: { isEmpty: boolean }) =>
    p.isEmpty &&
    css`
      color: #9e9e9e;
    `}
  ${markdownOverrides}
`;

const MarkdownViewer = React.memo(
  ({ source, label }: { source: string; label: string }) => {
    console.log('here!');
    let isEmpty;

    if (!source) {
      isEmpty = true;
      source = `${label}: (empty)`;
    }

    source = source
      .replace(/(#(\d+))\b/g, '<a href="/test/$2">$1</a>')
      .replace(/\n/g, '\n\n');

    return (
      <Wrapper isEmpty={isEmpty}>
        <ReactMarkdown source={source} />
      </Wrapper>
    );
  },
);

export default MarkdownViewer;

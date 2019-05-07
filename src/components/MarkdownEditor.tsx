import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';

const Wrapper = styled.div`
  background-color: var(--input-background-color);
  border-radius: 5px;
  color: white;
  outline: none;
  border: 1px solid var(--input-border-color);
  font-size: 16px;
  padding: 10px;
  margin-bottom: 13px;

  &:focus {
    border: 1px solid var(--input-border-color-focused);
    box-shadow: 0px 0px 0px 3px #172e51;
  }

  > div {
    /* overflow: visible !important; */
  }

  textarea {
    outline: none;
    border-radius: 4px;
    color: white !important;
  }
  pre {
    color: white;
  }
  .token.punctuation {
    color: #868686;
  }
  .token.property {
    color: #dc9e6f;
  }

  .token.title {
    color: #554df5;
  }

  .token.title .token.punctuation {
    color: #554df5;
  }
`;

const MarkdownEditor = ({
  minHeight,
  onChange,
}: {
  minHeight: string;
  onChange: (value: string) => void;
}) => {
  const uniqueIdentifier = Math.floor(Math.random() * 1000000000);
  const [state, setState] = useState('');

  useEffect(() => {
    const steps: HTMLTextAreaElement | null = document.querySelector(
      `#steps_${uniqueIdentifier}`,
    );

    if (steps) {
      steps.addEventListener('keyup', (e: any) => {
        onChange(steps.value);
      });

      steps.addEventListener('keypress', (e: any) => {
        let newState: string | undefined;
        const value = steps.value;

        if (e.keyCode === 13) {
          let lineStart = value.lastIndexOf('\n', steps.selectionStart - 1) + 1;
          let line = value.substring(lineStart, steps.selectionStart);

          let indentString: string | undefined;
          let replaceString: string | undefined;

          if (line.startsWith('* ')) {
            indentString = '*';
            replaceString = '*';
          } else if (line.startsWith('- ')) {
            indentString = '-';
            replaceString = '-';
          } else {
            let match = line.match(/^(\d+).*$/);
            if (match) {
              indentString = match[1] + '.';
              replaceString = String(Number(match[1]) + 1) + '.';
            }
          }

          if (indentString && replaceString) {
            const indentStringLength = indentString.length;
            const replaceStringLength = replaceString.length;
            const selectionStart = steps.selectionStart;

            if (line === `${indentString} `) {
              newState =
                value.substr(0, steps.selectionStart - 2 - indentStringLength) +
                '\n' +
                value.substr(steps.selectionStart);

              setState(newState);

              steps.selectionStart = selectionStart - replaceStringLength - 1;
              steps.selectionEnd = steps.selectionStart;

              e.preventDefault();
            } else {
              newState =
                value.substr(0, steps.selectionStart) +
                `\n${replaceString} ` +
                value.substr(steps.selectionStart);

              setState(newState);

              steps.selectionStart = selectionStart + 2 + replaceStringLength;
              steps.selectionEnd = steps.selectionStart;
              e.preventDefault();
            }
          }
        }
      });
    }
  }, []);

  return (
    <Wrapper>
      <Editor
        value={state}
        onValueChange={setState}
        highlight={code => highlight(code, languages.markdown)}
        padding={0}
        ignoreTabKey
        textareaId={`steps_${uniqueIdentifier}`}
        style={{
          fontFamily: '"helvetica", "Fira Mono", monospace',
          fontSize: '16px',
          minHeight: minHeight,
        }}
      />
    </Wrapper>
  );
};

export default MarkdownEditor;

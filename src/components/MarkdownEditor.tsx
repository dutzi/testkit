import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';

const Wrapper = styled.div`
  color: black;
  outline: none;
  font-size: 16px;

  border-left: 1px solid #e6e6e6;

  &:first-child {
    border-bottom: 1px solid #e6e6e6;
  }
  /* box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12); */

  > div {
    /* overflow: visible !important; */
  }

  textarea {
    outline: none;
    background: #ffffff99 !important;
    padding: 10px !important;
  }

  pre {
    padding: 10px !important;
  }

  pre {
    color: black;
  }
  .token.punctuation {
    color: #aaa;
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
  initialValue,
  minHeight,
  onChange,
  placeholder,
}: {
  initialValue: string;
  minHeight: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => {
  const uniqueIdentifier = Math.floor(Math.random() * 1000000000);
  const [state, setState] = useState(initialValue);

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
        placeholder={placeholder}
        style={{
          fontFamily: '"Roboto", "Fira Mono", monospace',
          fontSize: '16px',
          minHeight: minHeight,
        }}
      />
    </Wrapper>
  );
};

export default MarkdownEditor;

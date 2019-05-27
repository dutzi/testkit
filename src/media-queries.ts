import { css } from 'styled-components';

const sizes: {
  [device: string]: string;
} = {
  desktop: '@media only screen and (min-device-width: 1024px)',
  tablet: `@media only screen
      and (min-device-width : 768px)
      and (max-device-width : 1024px)`,
  mobile: `@media only screen
      and (min-device-width : 320px)
      and (max-device-width : 812px)
      and (-webkit-device-pixel-ratio : 3),
    only screen
      and (min-device-width : 320px)
      and (max-device-width : 667px)`,
};

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc: any, label: string) => {
  acc[label] = (
    ...args: [TemplateStringsArray, ...TemplateStringsArray[]]
  ) => css`
    ${sizes[label]} {
      ${css(...args)}
    }
  `;

  return acc;
}, {});

export default media;

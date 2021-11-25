export {};

type Render = (jsxElement: Function, ele: HTMLElement) => void;

declare module 'jsx-no-react' {
  const render: Render;
}

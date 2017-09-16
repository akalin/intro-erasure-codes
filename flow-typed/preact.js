declare class Component<Props, State> {
  props: Props;
  state: State;
  base: HTMLElement;

  constructor(props: Props): Component<Props, State>;

  setState(state: State | (state: State) => State): void;
};

declare class VNode {};

type VChild = void | null | boolean | number | string | VNode | HTMLElement | VChild[];

declare var preact: {
  h(nodeName: string | Function, attributes: ?{}, ...children: VChild[]): VNode;
  Component: typeof Component,
};

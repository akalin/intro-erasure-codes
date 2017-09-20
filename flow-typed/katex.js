type KaTeXOptions = {
  displayMode?: boolean,
  throwOnError?: boolean,
  errorColor?: string,
  macros?: { [string]: string },
  colorIsTextColor?: boolean,
  maxSize?: number,
};

declare var katex: {
  render(expression: string, baseNode: HTMLElement, options: ?KaTeXOptions): void;
};

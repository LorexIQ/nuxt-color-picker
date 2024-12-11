type ColorSelectionOptions = {
  signal?: AbortSignal;
};

type ColorSelectionResult = {
  sRGBHex: string;
};

type EyeDropper = {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
};

type EyeDropperConstructor = {
  new (): EyeDropper;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
  EyeDropper?: EyeDropperConstructor | undefined;
}

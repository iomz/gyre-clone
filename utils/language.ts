export function languageName(code: string) {
  return new Intl.DisplayNames([code], { type: "language" }).of(code);
}

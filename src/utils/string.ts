export function capitalizeWords(sentence: string): string {
  return sentence.replace(/\b\w/g, (c) => c.toUpperCase())
}

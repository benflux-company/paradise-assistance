// While a Settings field is empty, show the same bracketed placeholder the
// reference site displays, per section 3.3 of the migration brief.
export function orPlaceholder(value: string, placeholder: string): string {
  return value.trim() ? value : placeholder;
}

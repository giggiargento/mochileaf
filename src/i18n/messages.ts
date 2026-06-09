import en from './ui/en.json';

export function t(
  key: string,
  _localeOrVars?: unknown,
  vars?: Record<string, string>,
): string {
  let v = vars;
  if (_localeOrVars && typeof _localeOrVars === 'object') {
    v = _localeOrVars as Record<string, string>;
  }
  let text = en[key as keyof typeof en] ?? key;
  if (v) {
    for (const [name, value] of Object.entries(v)) {
      text = text.replaceAll(`{${name}}`, value);
    }
  }
  return text;
}

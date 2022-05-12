export function filterPathByRegex(
  list: string[] = [],
  regex: string
): string[] {
  if (list && list.length) {
    const reg = new RegExp(regex);
    return list.filter((path) => reg.test(path));
  }
  return [];
}

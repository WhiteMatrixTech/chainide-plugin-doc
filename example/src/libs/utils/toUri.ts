export const PATH_SPLIT = '/';

export function toUri(projectId: string, path?: string) {
  if (path) {
    return `${projectId}${PATH_SPLIT}${path}`;
  }
  return projectId;
}

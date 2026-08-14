/** Builds a deterministic local-only share identifier from one task and email pair. */
export function buildLocalTaskShareId(taskId: string, email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  return `local:${taskId}:${normalizedEmail}`;
}

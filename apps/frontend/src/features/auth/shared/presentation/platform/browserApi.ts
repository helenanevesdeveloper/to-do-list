/** Focuses an input element by DOM id when it exists. */
export function focusElementById(elementId: string | undefined): void {
  if (!elementId) {
    return;
  }

  const input = document.getElementById(elementId);
  if (input) {
    input.focus();
  }
}

/** Navigates to another route using the browser location API. */
export function navigateTo(pathname: string): void {
  window.location.assign(pathname);
}

/** Reads the current pathname through the shared browser adapter. */
export function getCurrentPathname(): string {
  return window.location.pathname;
}

/** Schedules a browser timeout through a shared adapter. */
export function scheduleTimeout(callback: () => void, delayMs: number): number {
  return window.setTimeout(callback, delayMs);
}

/** Cancels a timeout created by the shared timeout adapter. */
export function cancelScheduledTimeout(timeoutId: number): void {
  window.clearTimeout(timeoutId);
}

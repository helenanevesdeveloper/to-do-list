import { navigateTo } from '../../../shared/presentation/platform/browserApi.js';

/**
 * Owns success-only navigation concerns for the login flow.
 */
export function useLoginSuccessNavigation() {
  function goToDashboard(): void {
    navigateTo('/dashboard');
  }

  return {
    goToDashboard
  };
}

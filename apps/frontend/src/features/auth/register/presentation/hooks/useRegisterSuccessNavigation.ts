import { navigateTo } from '../../../shared/presentation/platform/browserApi.js';
import { useRegisterRedirectCountdown } from './useRegisterRedirectCountdown.js';

/**
 * Owns success-only navigation concerns for the register flow.
 */
export function useRegisterSuccessNavigation(successEmail: string) {
  const successRedirectSeconds = 5;
  const { redirectCountdown, restartCountdown } = useRegisterRedirectCountdown({
    isActive: Boolean(successEmail),
    initialSeconds: successRedirectSeconds,
    destinationPath: '/'
  });

  function goToHome() {
    navigateTo('/');
  }

  return {
    redirectCountdown,
    restartCountdown,
    goToHome
  };
}

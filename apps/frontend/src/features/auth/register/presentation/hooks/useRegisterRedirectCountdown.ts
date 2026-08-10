import { useEffect, useState } from 'react';
import {
  cancelScheduledTimeout,
  navigateTo,
  scheduleTimeout
} from '../../../shared/presentation/platform/browserApi.js';

type UseRegisterRedirectCountdownArgs = {
  isActive: boolean;
  initialSeconds: number;
  destinationPath: string;
};

/**
 * Drives the post-registration redirect countdown once success becomes active.
 */
export function useRegisterRedirectCountdown({
  isActive,
  initialSeconds,
  destinationPath
}: UseRegisterRedirectCountdownArgs): {
  redirectCountdown: number;
  restartCountdown: () => void;
} {
  const [redirectCountdown, setRedirectCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (redirectCountdown === 0) {
      navigateTo(destinationPath);
      return;
    }

    const timeoutId = scheduleTimeout(() => {
      setRedirectCountdown((current: number) => current - 1);
    }, 1000);

    return () => {
      cancelScheduledTimeout(timeoutId);
    };
  }, [destinationPath, isActive, redirectCountdown]);

  function restartCountdown() {
    setRedirectCountdown(initialSeconds);
  }

  return {
    redirectCountdown,
    restartCountdown
  };
}

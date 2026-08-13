import { useCallback, useEffect, useState } from 'react';
import { listTaskCategoriesApi } from '../../infrastructure/listTaskCategoriesApi';
import type { TaskCategoryOption } from '../../../shared/types';

type TaskCategoriesState = {
  errorMessage: string | null;
  isLoading: boolean;
  options: TaskCategoryOption[];
};

function buildInitialTaskCategoriesState(): TaskCategoriesState {
  return {
    errorMessage: null,
    isLoading: true,
    options: []
  };
}

function getTaskCategoriesErrorMessage(): string {
  return 'Nao foi possivel carregar as categorias.';
}

/** Loads the authenticated user's task categories and exposes retry state. */
export function useTaskCategories(): {
  errorMessage: string | null;
  isLoading: boolean;
  options: TaskCategoryOption[];
  reload: () => void;
} {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<TaskCategoriesState>(
    buildInitialTaskCategoriesState
  );

  const reload = useCallback((): void => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    setState((current) => ({
      ...current,
      errorMessage: null,
      isLoading: true
    }));

    listTaskCategoriesApi()
      .then((options) => {
        if (!isActive) {
          return;
        }

        setState({
          errorMessage: null,
          isLoading: false,
          options
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setState((current) => ({
          ...current,
          errorMessage: getTaskCategoriesErrorMessage(),
          isLoading: false
        }));
      });

    return () => {
      isActive = false;
    };
  }, [reloadToken]);

  return {
    errorMessage: state.errorMessage,
    isLoading: state.isLoading,
    options: state.options,
    reload
  };
}

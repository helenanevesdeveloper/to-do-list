import type { TaskCategoryOption } from '../../shared/types';

export type ListTaskCategoriesApiResponse = {
  count: number;
  results: ListTaskCategoriesApiItem[];
};

type ListTaskCategoriesApiItem = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
};

/** Maps the backend category-list response into the lightweight option shape used by the UI. */
export function mapListTaskCategoriesApiResponse(
  response: ListTaskCategoriesApiResponse
): TaskCategoryOption[] {
  return response.results.map((item) => ({
    id: item.id,
    name: item.name
  }));
}

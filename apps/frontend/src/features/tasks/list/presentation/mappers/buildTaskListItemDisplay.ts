import type { TaskListItem } from '../../../shared/types.js';

export type TaskListItemDisplay = {
  categoryLabel: string;
  descriptionLabel: string;
  sharingLabel: string;
  statusColorScheme: 'green' | 'yellow';
  statusLabel: string;
  updatedAtLabel: string;
};

/** Formats an ISO timestamp into a compact pt-BR label for task list rendering. */
function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

/** Maps sharing metadata into the compact label used by the task list UI. */
function buildSharingLabel(task: TaskListItem): string {
  if (task.sharing.isOwner) {
    return task.sharing.isShared
      ? `Compartilhada com ${task.sharing.sharedCount}`
      : 'Privada';
  }

  return task.sharing.permission === 'edit' ? 'Recebida com edição' : 'Recebida com leitura';
}

/** Builds the render-ready labels and colors for a single task list item. */
export function buildTaskListItemDisplay(task: TaskListItem): TaskListItemDisplay {
  return {
    categoryLabel: task.category?.name ?? 'Sem categoria',
    descriptionLabel: task.description ?? 'Sem descrição',
    sharingLabel: buildSharingLabel(task),
    statusColorScheme: task.isCompleted ? 'green' : 'yellow',
    statusLabel: task.isCompleted ? 'Concluída' : 'Pendente',
    updatedAtLabel: formatUpdatedAt(task.updatedAt)
  };
}

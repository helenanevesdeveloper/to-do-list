import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';

/** Local sample categories used until task categories are loaded from the API. */
export const TASK_CATEGORY_SAMPLE_OPTIONS: TaskCategoryOption[] = [
  { id: 'cat-work', name: 'Work' },
  { id: 'cat-home', name: 'Home' },
  { id: 'cat-ops', name: 'Ops' }
];

type TaskListSampleTemplate = Omit<TaskListItem, 'id'>;

const TASK_LIST_SAMPLE_TEMPLATES: TaskListSampleTemplate[] = [
  {
    title: 'Prepare backend release checklist',
    description: 'Owned task used to validate the default dashboard state.',
    isCompleted: false,
    createdAt: '2026-08-10T09:00:00+00:00',
    updatedAt: '2026-08-12T12:30:00+00:00',
    category: { id: 'cat-work', name: 'Work', color: '#0055AA' },
    sharing: {
      isOwner: true,
      permission: 'owner',
      isShared: true,
      sharedCount: 2
    }
  },
  {
    title: 'Buy light bulbs',
    description: 'Private home task without sharing.',
    isCompleted: false,
    createdAt: '2026-08-09T16:00:00+00:00',
    updatedAt: '2026-08-11T18:00:00+00:00',
    category: { id: 'cat-home', name: 'Home', color: null },
    sharing: {
      isOwner: true,
      permission: 'owner',
      isShared: false,
      sharedCount: 0
    }
  },
  {
    title: 'Update incident template',
    description: 'Shared task with read-only access.',
    isCompleted: true,
    createdAt: '2026-08-08T14:00:00+00:00',
    updatedAt: '2026-08-12T08:15:00+00:00',
    category: { id: 'cat-ops', name: 'Ops', color: '#7A3E9D' },
    sharing: {
      isOwner: false,
      permission: 'reader',
      isShared: true,
      sharedCount: 2
    }
  },
  {
    title: 'Archive outdated docs',
    description: null,
    isCompleted: true,
    createdAt: '2026-08-07T11:30:00+00:00',
    updatedAt: '2026-08-10T15:45:00+00:00',
    category: null,
    sharing: {
      isOwner: true,
      permission: 'owner',
      isShared: true,
      sharedCount: 1
    }
  },
  {
    title: 'Review on-call handoff',
    description: 'Shared task with read-only access.',
    isCompleted: false,
    createdAt: '2026-08-06T10:10:00+00:00',
    updatedAt: '2026-08-11T09:20:00+00:00',
    category: { id: 'cat-ops', name: 'Ops', color: '#7A3E9D' },
    sharing: {
      isOwner: false,
      permission: 'reader',
      isShared: true,
      sharedCount: 1
    }
  }
];

/** Local sample tasks used to render the dashboard list before API wiring lands. */
export const TASK_LIST_SAMPLE_DATA: TaskListItem[] = Array.from(
  { length: 28 },
  (_, index) => {
    const template = TASK_LIST_SAMPLE_TEMPLATES[index % TASK_LIST_SAMPLE_TEMPLATES.length];

    return {
      ...template,
      id: `task-${index + 1}`,
      title: `${template.title} #${index + 1}`,
      createdAt: `2026-08-${String((index % 9) + 1).padStart(2, '0')}T09:00:00+00:00`,
      updatedAt: `2026-08-${String((index % 9) + 4).padStart(2, '0')}T12:30:00+00:00`
    };
  }
);

import type { TaskShare } from '../../domain/taskShare';

/** Local in-memory task-share collections keyed by task identifier. */
export type TaskShareStore = Record<string, readonly TaskShare[]>;

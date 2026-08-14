import TaskShareModal from '../../../sharing/presentation/components/TaskShareModal';

export interface TaskDashboardShareModalMountProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  taskTitle: string | null;
}

/** Mounts the dashboard share modal while keeping its wiring outside the page shell. */
export default function TaskDashboardShareModalMount({
  isOpen,
  onClose,
  taskId,
  taskTitle
}: TaskDashboardShareModalMountProps) {
  return (
    <TaskShareModal
      isOpen={isOpen}
      onClose={onClose}
      taskId={taskId}
      taskTitle={taskTitle}
    />
  );
}

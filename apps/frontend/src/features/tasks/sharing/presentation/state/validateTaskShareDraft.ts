import type { TaskShare } from '../../domain/taskShare';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export interface ValidateTaskShareDraftInput {
  email: string;
  ownerEmail: string;
  shares: readonly TaskShare[];
}

/** Validates one local share draft before it is added to the modal store. */
export function validateTaskShareDraft({
  email,
  ownerEmail,
  shares
}: ValidateTaskShareDraftInput): string | null {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return 'Digite um email para compartilhar a tarefa.';
  }

  if (!isValidEmail(normalizedEmail)) {
    return 'Digite um email válido para compartilhar a tarefa.';
  }

  if (normalizedEmail === ownerEmail.toLowerCase()) {
    return 'O proprietário da tarefa já aparece na lista de acesso.';
  }

  if (shares.some((share) => share.email.toLowerCase() === normalizedEmail)) {
    return 'Este email já possui acesso a esta tarefa.';
  }

  return null;
}

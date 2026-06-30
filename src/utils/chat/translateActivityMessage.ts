import { TFunction } from 'i18next';

/**
 * Translates English activity messages from the backend into the current language.
 * Backend sends messages like "User self-assigned this conversation" in English.
 * This function maps common patterns to translated versions.
 */
export function translateActivityMessage(content: string, t: TFunction): string {
  if (!content) return content;

  // Pattern: "{name} self-assigned this conversation"
  const selfAssignedMatch = content.match(/^(.+?)\s+self-assigned\s+this\s+conversation$/i);
  if (selfAssignedMatch) {
    const name = selfAssignedMatch[1];
    return t('activityMessages.selfAssigned', { name, defaultValue: `${name} atribuiu a si mesmo esta conversa` });
  }

  // Pattern: "Conversation was assigned to {name} by {assigner}"
  const assignedByMatch = content.match(/^Conversation\s+was\s+assigned\s+to\s+(.+?)\s+by\s+(.+)$/i);
  if (assignedByMatch) {
    const [, name, assigner] = assignedByMatch;
    return t('activityMessages.assignedToBy', { name, assigner, defaultValue: `Conversa atribuída a ${name} por ${assigner}` });
  }

  // Pattern: "Conversation assigned to {name}"
  const assignedToMatch = content.match(/^Conversation\s+assigned\s+to\s+(.+)$/i);
  if (assignedToMatch) {
    const name = assignedToMatch[1];
    return t('activityMessages.assignedTo', { name, defaultValue: `Conversa atribuída a ${name}` });
  }

  // Pattern: "Conversation unassigned by {name}"
  const unassignedByMatch = content.match(/^Conversation\s+unassigned\s+by\s+(.+)$/i);
  if (unassignedByMatch) {
    const name = unassignedByMatch[1];
    return t('activityMessages.unassignedBy', { name, defaultValue: `Conversa desatribuída por ${name}` });
  }

  // Pattern: "Conversation was marked resolved by {name}"
  const resolvedByMatch = content.match(/^Conversation\s+was\s+marked\s+resolved\s+by\s+(.+)$/i);
  if (resolvedByMatch) {
    const name = resolvedByMatch[1];
    return t('activityMessages.resolvedBy', { name, defaultValue: `Conversa marcada como resolvida por ${name}` });
  }

  // Pattern: "Conversation was marked pending by {name}"
  const pendingByMatch = content.match(/^Conversation\s+was\s+marked\s+pending\s+by\s+(.+)$/i);
  if (pendingByMatch) {
    const name = pendingByMatch[1];
    return t('activityMessages.pendingBy', { name, defaultValue: `Conversa marcada como pendente por ${name}` });
  }

  // Pattern: "Conversation was reopened by {name}"
  const reopenedByMatch = content.match(/^Conversation\s+was\s+reopened\s+by\s+(.+)$/i);
  if (reopenedByMatch) {
    const name = reopenedByMatch[1];
    return t('activityMessages.reopenedBy', { name, defaultValue: `Conversa reaberta por ${name}` });
  }

  // Pattern: "{name} added {label}" (label added)
  const labelAddedMatch = content.match(/^(.+?)\s+added\s+(.+)$/i);
  if (labelAddedMatch) {
    const [, name, label] = labelAddedMatch;
    return t('activityMessages.labelAdded', { name, label, defaultValue: `${name} adicionou ${label}` });
  }

  // Pattern: "{name} removed {label}" (label removed)
  const labelRemovedMatch = content.match(/^(.+?)\s+removed\s+(.+)$/i);
  if (labelRemovedMatch) {
    const [, name, label] = labelRemovedMatch;
    return t('activityMessages.labelRemoved', { name, label, defaultValue: `${name} removeu ${label}` });
  }

  // Pattern: "Priority changed to {priority} by {name}"
  const priorityChangedMatch = content.match(/^Priority\s+changed\s+to\s+(.+?)\s+by\s+(.+)$/i);
  if (priorityChangedMatch) {
    const [, priority, name] = priorityChangedMatch;
    return t('activityMessages.priorityChanged', { priority, name, defaultValue: `Prioridade alterada para ${priority} por ${name}` });
  }

  // Pattern: "{name} joined the conversation"
  const joinedMatch = content.match(/^(.+?)\s+joined\s+the\s+conversation$/i);
  if (joinedMatch) {
    const name = joinedMatch[1];
    return t('activityMessages.joined', { name, defaultValue: `${name} entrou na conversa` });
  }

  // Pattern: "{name} left the conversation"
  const leftMatch = content.match(/^(.+?)\s+left\s+the\s+conversation$/i);
  if (leftMatch) {
    const name = leftMatch[1];
    return t('activityMessages.left', { name, defaultValue: `${name} saiu da conversa` });
  }

  // Pattern: "Team {name} assigned to conversation"
  const teamAssignedMatch = content.match(/^Team\s+(.+?)\s+assigned\s+to\s+conversation$/i);
  if (teamAssignedMatch) {
    const name = teamAssignedMatch[1];
    return t('activityMessages.teamAssigned', { name, defaultValue: `Time ${name} atribuído à conversa` });
  }

  // Pattern: "Team {name} removed from conversation"
  const teamRemovedMatch = content.match(/^Team\s+(.+?)\s+removed\s+from\s+conversation$/i);
  if (teamRemovedMatch) {
    const name = teamRemovedMatch[1];
    return t('activityMessages.teamRemoved', { name, defaultValue: `Time ${name} removido da conversa` });
  }

  // If no pattern matches, return original content
  return content;
}

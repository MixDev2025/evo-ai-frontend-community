import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card, CardContent, Badge } from '@evoapi/design-system';
import { Edit, Trash2, Copy, Zap } from 'lucide-react';
import type { AutomationRule } from '@/types/automation';
import { useDateFormat } from '@/hooks/useDateFormat';

interface Props {
  automation: AutomationRule;
  onEdit: (rule: AutomationRule) => void;
  onDelete: (rule: AutomationRule) => void;
  onClone: (rule: AutomationRule) => void;
  canEdit: boolean;
  canDelete: boolean;
  canClone: boolean;
}

export default function AutomationCard({
  automation,
  onEdit,
  onDelete,
  onClone,
  canEdit,
  canDelete,
  canClone,
}: Props) {
  const { t } = useLanguage('automation');
  const { formatDateTime } = useDateFormat();

  const ts = (automation as unknown as { created_at?: string; created_on?: number }).created_at;
  const fallback = (automation as unknown as { created_on?: number }).created_on;
  const value = ts ?? (fallback ? new Date(fallback).toISOString() : null);

  return (
    <Card className="group relative bg-sidebar border-sidebar-border hover:bg-sidebar-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 p-4 border-b border-sidebar-border">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate text-sidebar-foreground">
              {automation.name}
            </h3>
            {automation.description && (
              <p className="text-xs text-sidebar-foreground/60 truncate mt-1">{automation.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {t(`form.fields.event.options.${automation.event_name}`)}
              </Badge>
              <Badge variant={automation.active ? 'default' : 'secondary'} className="text-xs">
                {automation.active ? t('table.status.active') : t('table.status.inactive')}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{automation.actions?.length ?? 0}</span>
          </div>
        </div>

        {value && (
          <div className="px-4 py-3 text-xs text-sidebar-foreground/70">
            <span>{t('table.columns.createdAt')}: {formatDateTime(value)}</span>
          </div>
        )}

        <div className="flex border-t border-sidebar-border opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          {canEdit && (
            <>
              <Button
                variant="ghost"
                className="rounded-none h-12 flex-1 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                onClick={() => onEdit(automation)}
              >
                <Edit className="h-4 w-4 mr-1" />
                <span className="text-xs">{t('table.actions.edit')}</span>
              </Button>
              <div className="w-px bg-sidebar-border" />
            </>
          )}
          {canClone && (
            <>
              <Button
                variant="ghost"
                className="rounded-none h-12 flex-1 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                onClick={() => onClone(automation)}
              >
                <Copy className="h-4 w-4 mr-1" />
                <span className="text-xs">{t('table.actions.clone')}</span>
              </Button>
              <div className="w-px bg-sidebar-border" />
            </>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              className="rounded-none h-12 flex-1 text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(automation)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('table.actions.delete')}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { useLanguage } from '@/hooks/useLanguage';
import { Button, Input } from '@evoapi/design-system';
import { Plus, Search, Trash2 } from 'lucide-react';

interface Props {
  totalCount: number;
  selectedCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onNewAutomation: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  canCreate: boolean;
  canDelete: boolean;
}

export default function AutomationsHeader({
  totalCount,
  selectedCount,
  searchValue,
  onSearchChange,
  onNewAutomation,
  onBulkDelete,
  onClearSelection,
  canCreate,
  canDelete,
}: Props) {
  const { t } = useLanguage('automation');

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-xl font-semibold">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('page.subtitle', { count: totalCount })}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('page.searchPlaceholder')}
            className="pl-8 w-full sm:w-64"
          />
        </div>
        {selectedCount > 0 && canDelete && (
          <>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              {t('page.clearSelection', { count: selectedCount })}
            </Button>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t('page.bulkDelete')}
            </Button>
          </>
        )}
        {canCreate && (
          <Button size="sm" onClick={onNewAutomation}>
            <Plus className="h-4 w-4 mr-2" />
            {t('page.newAutomation')}
          </Button>
        )}
      </div>
    </div>
  );
}

import { twMerge } from 'tailwind-merge';

type ManageTransactionModalSpendingGroupsProps = {
  isLoading?: boolean;
  spendingGroups: Array<{ id: number; name: string }> | undefined;
  selectedIds: number[];
  handleSelect: (id: number) => void;
};

export const ManageTransactionModalSpendingGroups = ({
  /**
   * TODO: add loading state.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoading,
  selectedIds,
  spendingGroups,
  handleSelect,
}: ManageTransactionModalSpendingGroupsProps) => (
  <div className="mb-4 flex flex-grow flex-col gap-2 overflow-y-hidden">
    <div className="flex flex-col items-start gap-4 overflow-y-hidden">
      <div className="grid h-full w-full grid-cols-3 gap-4 overflow-y-auto sm:grid-cols-9">
        {spendingGroups?.map((group) => {
          const isSelected = selectedIds.includes(group.id);

          return (
            <button
              onClick={() => handleSelect(group.id)}
              key={group.id}
              type="button"
              className={twMerge(
                'group flex flex-col items-center gap-2 rounded-2xl bg-white p-2',
                !isSelected &&
                  'group-hover:bg-main-blue group-hover:text-white',
                isSelected && 'bg-main-dark text-white',
              )}
            >
              <span
                className={twMerge(
                  'w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm',
                  isSelected && 'font-medium',
                )}
              >
                {group.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

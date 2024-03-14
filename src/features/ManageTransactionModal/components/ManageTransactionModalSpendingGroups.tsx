import { twMerge } from 'tailwind-merge';

type ManageTransactionModalSpendingGroupsProps = {
  isLoading?: boolean;
  spendingGroups: Array<{ id: number; name: string }> | undefined;
  selectedIds: number[];
  handleSelect: (id: number) => void;
  handleToggle: () => void;
  isChecked: boolean;
};

export const ManageTransactionModalSpendingGroups = ({
  isLoading,
  selectedIds,
  spendingGroups,
  handleSelect,
  handleToggle,
  isChecked,
}: ManageTransactionModalSpendingGroupsProps) => {
  return (
    <>
      <div className="mb-4 flex gap-2">
        <label htmlFor="addToSpendingGroup">Add to spending group</label>

        <div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              name="addToSpendingGroup"
              checked={isChecked}
              onChange={handleToggle}
            />

            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-main-blue peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full" />
          </label>
        </div>
      </div>

      {isChecked && (
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
      )}
    </>
  );
};

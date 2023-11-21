import { api } from '@/shared/api/api';
import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { SquaresPlusIcon } from '@/shared/ui/Icons/SquaresPlusIcon';
import { Disclosure, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';

export const CategoriesDisclosure = () => {
  const { data: categories } = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  const reducedCategories = useMemo(
    () =>
      categories?.reduce(
        (categoriesAccumulator, category) => {
          if (category.type === 'deposit') {
            return {
              ...categoriesAccumulator,
              deposit: [...categoriesAccumulator.deposit, category],
            };
          } else
            return {
              ...categoriesAccumulator,
              expense: [...categoriesAccumulator.expense, category],
            };
        },
        {
          deposit: [] as Array<{
            id: number;
            name: string;
            user_id: number;
            type: 'deposit' | 'expense';
          }>,
          expense: [] as Array<{
            id: number;
            name: string;
            user_id: number;
            type: 'deposit' | 'expense';
          }>,
        },
      ),
    [categories],
  );

  return (
    <Disclosure>
      <Disclosure.Button className="flex w-full flex-col items-center py-4">
        <SquaresPlusIcon className="h-12 w-12 text-indigo-600" />

        <span>Categories</span>
      </Disclosure.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={Fragment}
      >
        <Disclosure.Panel className="max-h-44 min-h-full w-full overflow-y-auto">
          <div className="bg-indigo-500">
            <div>
              <div className="flex w-full items-center justify-between bg-indigo-400 px-4 py-2">
                <span className="text-white">Expense</span>

                <button>
                  <PlusIcon className="text-white" />
                </button>
              </div>

              <div className="flex flex-col">
                {reducedCategories?.expense.map((category) => (
                  <button
                    className="px-4 py-2 text-left text-white hover:bg-indigo-400"
                    key={category.id}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex w-full items-center justify-between bg-indigo-400 px-4 py-2">
                <span className="text-white">Deposit</span>

                <button>
                  <PlusIcon className="text-white" />
                </button>
              </div>

              <div className="flex flex-col">
                {reducedCategories?.deposit.map((category) => (
                  <button
                    className="px-4 py-2 text-left text-white hover:bg-indigo-400"
                    key={category.id}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
};

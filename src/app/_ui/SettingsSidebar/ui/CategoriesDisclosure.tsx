import { Fragment, useMemo, useState } from 'react';

import { ManageCategoryModal } from '@/shared/ManageCategoryModal';
import { api } from '@/shared/api/api';
import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { SquaresPlusIcon } from '@/shared/ui/Icons/SquaresPlusIcon';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { Disclosure, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';

export const CategoriesDisclosure = () => {
  const loadingToast = useLoadingToast();

  const {
    value: isAddNewCategoryModalOpen,
    setTrue: handleOpenAddNewCategoryModal,
    setFalse: handleCloseAddNewCategoryModal,
  } = useBoolean(false);

  const [categoryTypeToAdd, setCategoryTypeToaAdd] = useState<
    null | 'deposit' | 'expense'
  >();

  const { data: categories, refetch: refetchCategories } = useQuery({
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

  const handleAddNewExpenseCategory = () => {
    setCategoryTypeToaAdd('expense');
    handleOpenAddNewCategoryModal();
  };

  const handleAddNewDepositCategory = () => {
    setCategoryTypeToaAdd('deposit');
    handleOpenAddNewCategoryModal();
  };

  const handleAddNewCategory = (categoryName: string) => {
    if (!categoryTypeToAdd) {
      return;
    }

    const toastId = loadingToast.showLoading('Adding your new category...');

    return api.categories
      .createOne({
        body: {
          name: categoryName,
          type: categoryTypeToAdd,
        },
      })
      .then(() => {
        refetchCategories();

        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully added a new category!',
        });
      })
      .catch(() => {
        loadingToast.handleError({
          toastId,
          message:
            'Something gone wrong while adding your category. Try again.',
        });
      });
  };

  return (
    <>
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

                  <button onClick={handleAddNewExpenseCategory}>
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

                  <button onClick={handleAddNewDepositCategory}>
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

      <ManageCategoryModal
        handleClose={handleCloseAddNewCategoryModal}
        handleSubmit={handleAddNewCategory}
        isModalOpen={isAddNewCategoryModalOpen}
        title="Add new category"
        submitButtonLabel="Add"
      />
    </>
  );
};

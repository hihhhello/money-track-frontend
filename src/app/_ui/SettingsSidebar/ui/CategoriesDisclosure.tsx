import { Fragment, useMemo, useState } from 'react';

import { ManageCategoryModal } from '@/shared/ManageCategoryModal';
import { api } from '@/shared/api/api';
import { PlusIcon } from '@/shared/ui/Icons/PlusIcon';
import { SquaresPlusIcon } from '@/shared/ui/Icons/SquaresPlusIcon';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { Disclosure, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Category } from '@/shared/types/categoryTypes';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';

export const CategoriesDisclosure = () => {
  const loadingToast = useLoadingToast();

  const {
    value: isAddNewCategoryModalOpen,
    setTrue: handleOpenAddNewCategoryModal,
    setFalse: handleCloseAddNewCategoryModal,
  } = useBoolean(false);

  const {
    value: isEditCategoryModalOpen,
    setTrue: handleOpenEditCategoryModal,
    setFalse: handleCloseEditCategoryModal,
  } = useBoolean(false);

  const [categoryTypeToAdd, setCategoryTypeToaAdd] =
    useState<null | FinancialOperationTypeValue>();
  const [selectedCategory, setSelectedCategory] = useState<null | Category>(
    null,
  );

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  const reducedCategories = useMemo(
    () =>
      categories?.reduce<{ deposit: Category[]; expense: Category[] }>(
        (categoriesAccumulator, category) => {
          if (category.type === FinancialOperationType.DEPOSIT) {
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
          deposit: [],
          expense: [],
        },
      ),
    [categories],
  );

  const handleAddNewExpenseCategory = () => {
    setCategoryTypeToaAdd(FinancialOperationType.EXPENSE);
    handleOpenAddNewCategoryModal();
  };

  const handleAddNewDepositCategory = () => {
    setCategoryTypeToaAdd(FinancialOperationType.DEPOSIT);
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

  const handleEditCategory = (categoryName: string) => {
    toast.warn('Editing is not implemented yet.');

    return;
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) {
      return;
    }

    const toastId = loadingToast.showLoading('Deleting your category...');

    return api.categories
      .deleteOne({
        params: {
          categoryId: selectedCategory?.id,
        },
      })
      .then(() => {
        refetchCategories();

        loadingToast.handleSuccess({
          toastId,
          message: 'You successfully deleted category!',
        });
      })
      .catch(() => {
        loadingToast.handleError({
          toastId,
          message:
            'Something gone wrong while deleting your category. Try again.',
        });
      });
  };

  return (
    <>
      <Disclosure>
        <Disclosure.Button className="flex w-full flex-col items-center py-4 hover:bg-gray-200">
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
                      onClick={() => {
                        handleOpenEditCategoryModal();
                        setSelectedCategory(category);
                      }}
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
                      onClick={() => {
                        handleOpenEditCategoryModal();
                        setSelectedCategory(category);
                      }}
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

      <ManageCategoryModal
        handleClose={handleCloseEditCategoryModal}
        handleSubmit={handleEditCategory}
        isModalOpen={isEditCategoryModalOpen}
        defaultCategoryName={selectedCategory?.name}
        title="Edit category"
        submitButtonLabel="Edit"
        handleDelete={handleDeleteCategory}
      />
    </>
  );
};

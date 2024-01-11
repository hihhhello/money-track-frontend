'use client';

import { useMemo, useState } from 'react';

import { ManageCategoryModal } from '@/shared/ui/ManageCategoryModal';
import { api } from '@/shared/api/api';
import { PlusIcon } from '@/shared/icons/PlusIcon';
import { useBoolean, useLoadingToast } from '@/shared/utils/hooks';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Category } from '@/shared/types/categoryTypes';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';

type CategoriesPageContentProps = {
  categories: Category[];
};

export const CategoriesPageContent = ({
  categories: initialCategories,
}: CategoriesPageContentProps) => {
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
    initialData: initialCategories,
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
    <div>
      <div>
        <div className="mb-8 rounded-3xl bg-main-paper p-4">
          <div className="mb-6 inline-flex items-center justify-between">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Expense</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {reducedCategories?.expense?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  handleOpenEditCategoryModal();
                  setSelectedCategory(category);
                }}
                className="h-full rounded-3xl bg-white px-4 py-2 shadow-md transition-colors hover:bg-main-dark hover:text-white"
              >
                {category.name}
              </button>
            ))}

            <button
              type="button"
              onClick={handleAddNewExpenseCategory}
              className="flex h-full gap-2 rounded-3xl bg-main-blue px-4 py-2 text-main-white shadow-md hover:bg-main-blue/90"
            >
              New
              <PlusIcon />
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-main-paper p-4">
          <div className="mb-6 inline-flex items-center justify-between">
            <div className="inline-block rounded-full border border-main-dark px-6 py-2">
              <span className="text-main-dark">Deposit</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {reducedCategories?.deposit?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  handleOpenEditCategoryModal();
                  setSelectedCategory(category);
                }}
                className="h-full rounded-3xl bg-white px-4 py-2 shadow-md transition-colors hover:bg-main-dark hover:text-white"
              >
                {category.name}
              </button>
            ))}

            <button
              type="button"
              onClick={handleAddNewDepositCategory}
              className="flex h-full gap-2 rounded-3xl bg-main-blue px-4 py-2 text-main-white shadow-md hover:bg-main-blue/90"
            >
              New
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};

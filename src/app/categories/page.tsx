'use client';

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
import { classNames } from '@/shared/utils/helpers';

const CategoriesPage = () => {
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
    <div>
      <h1 className="mb-4">Categories</h1>

      <div>
        <div className="mb-4">
          <h2>Expense</h2>

          <div className="flex flex-wrap gap-4">
            {reducedCategories?.expense?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  handleOpenEditCategoryModal();
                  setSelectedCategory(category);
                }}
                className="h-full border border-gray-200 px-4 py-2 font-semibold shadow-sm hover:bg-gray-100"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2>Deposit</h2>

          <div className="flex flex-wrap gap-4">
            {reducedCategories?.deposit?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  handleOpenEditCategoryModal();
                  setSelectedCategory(category);
                }}
                className="h-full border border-gray-200 px-4 py-2 font-semibold shadow-sm hover:bg-gray-100"
              >
                {category.name}
              </button>
            ))}
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

export default CategoriesPage;

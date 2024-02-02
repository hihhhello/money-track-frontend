'use client';

import { useMemo, useState } from 'react';

import { ManageCategoryModal } from '@/shared/ui/Category/ManageCategoryModal';
import { api } from '@/shared/api/api';
import { useBoolean, useLoadingToast } from 'hihhhello-utils';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Category } from '@/shared/types/categoryTypes';
import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '@/shared/types/globalTypes';
import { CategoryItem } from '@/shared/ui/Category/CategoryItem';
import { CategoryList } from '@/shared/ui/Category/CategoryList';

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
    <div className="flex-grow overflow-y-hidden">
      <div className="flex h-full flex-col">
        <div className="mb-8 flex h-full flex-col overflow-y-hidden rounded-3xl bg-main-paper p-4">
          <div className="mb-6 inline-flex items-center justify-between">
            <div>
              <span className="text-xl text-main-dark">Expenses</span>
            </div>
          </div>

          <CategoryList
            className="pb-4"
            wrapperClassName="overflow-y-hidden"
            handleAddNewCategory={handleAddNewExpenseCategory}
          >
            {reducedCategories?.expense?.map((category) => (
              <CategoryItem
                key={category.id}
                onClick={() => {
                  handleOpenEditCategoryModal();
                  setSelectedCategory(category);
                }}
              >
                {category.name}
              </CategoryItem>
            ))}
          </CategoryList>
        </div>

        <div className="flex h-full flex-col overflow-y-hidden rounded-3xl bg-main-paper p-4">
          <div className="mb-6 inline-flex items-center justify-between">
            <div>
              <span className="text-xl text-main-dark">Deposits</span>
            </div>
          </div>

          <CategoryList
            className="pb-4"
            wrapperClassName="overflow-y-hidden"
            handleAddNewCategory={handleAddNewDepositCategory}
          >
            {reducedCategories?.deposit?.map((category) => (
              <CategoryItem
                key={category.id}
                onClick={() => {
                  handleOpenEditCategoryModal();
                  setSelectedCategory(category);
                }}
              >
                {category.name}
              </CategoryItem>
            ))}
          </CategoryList>
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

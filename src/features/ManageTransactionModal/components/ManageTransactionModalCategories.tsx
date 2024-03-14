import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'hihhhello-utils';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { ManageCategoryModal } from '@/features/ManageCategoryModal';
import { api } from '@/shared/api/api';
import { Category } from '@/shared/types/categoryTypes';
import { FinancialOperationTypeValue } from '@/shared/types/globalTypes';
import { CategoryItem } from '@/shared/ui/Category/CategoryItem';
import { CategoryList } from '@/shared/ui/Category/CategoryList';
import { CategoryListLoading } from '@/shared/ui/Category/CategoryListLoading';
import { useLoadingToast } from '@/shared/utils/hooks';

type ManageTransactionModalCategoriesProps = {
  handleSelectCategoryId: (id: number | null) => void;
  selectedCategoryId: number | null;
  transactionType: FinancialOperationTypeValue | undefined;
  handleAddNewCategory: (newCategory: Category) => void;
};

export const ManageTransactionModalCategories = ({
  handleAddNewCategory,
  handleSelectCategoryId,
  selectedCategoryId,
  transactionType,
}: ManageTransactionModalCategoriesProps) => {
  const loadingToast = useLoadingToast();

  const selectedCategoryRef = useRef<HTMLButtonElement>(null);

  const categoriesQuery = useQuery({
    queryFn: () => {
      if (!transactionType) {
        return [];
      }

      return api.categories.getAll({
        searchParams: {
          type: transactionType,
        },
      });
    },
    queryKey: ['api.categories.getAll', transactionType],
    enabled: Boolean(transactionType),
  });

  const {
    value: isAddNewCategoryModalOpen,
    setTrue: handleOpenAddNewCategoryModal,
    setFalse: handleCloseAddNewCategoryModal,
  } = useBoolean(false);

  const handleSubmitNewCategory = (categoryName: string) => {
    if (!transactionType) {
      return;
    }

    const toastId = loadingToast.showLoading('Adding your new category...');

    return api.categories
      .createOne({
        body: {
          name: categoryName,
          type: transactionType,
        },
      })
      .then((newCategory) => {
        handleAddNewCategory(newCategory);
        categoriesQuery.refetch();

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

  useEffect(() => {
    if (
      !selectedCategoryId ||
      !selectedCategoryRef.current ||
      categoriesQuery.isLoading
    ) {
      return;
    }

    selectedCategoryRef.current.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }, [categoriesQuery.isLoading, selectedCategoryId]);

  return (
    <>
      <div className="mb-4 flex min-h-[430px] flex-grow flex-col gap-2 overflow-y-hidden sm:min-h-[200px]">
        <span>Category</span>

        {categoriesQuery.isLoading ? (
          <CategoryListLoading
            handleAddNewCategory={handleOpenAddNewCategoryModal}
          />
        ) : (
          <CategoryList
            className="mb-2 p-2"
            wrapperClassName="overflow-y-hidden"
            handleAddNewCategory={handleOpenAddNewCategoryModal}
          >
            {categoriesQuery.data?.map((category) => (
              <CategoryItem
                key={category.id}
                onClick={() => handleSelectCategoryId(category.id)}
                isSelected={selectedCategoryId === category.id}
                ref={
                  selectedCategoryId === category.id
                    ? selectedCategoryRef
                    : null
                }
              >
                {category.name}
              </CategoryItem>
            ))}
          </CategoryList>
        )}
      </div>

      <ManageCategoryModal
        handleClose={handleCloseAddNewCategoryModal}
        handleSubmit={handleSubmitNewCategory}
        isModalOpen={isAddNewCategoryModalOpen}
        title="Add new category"
        submitButtonLabel="Add"
      />
    </>
  );
};

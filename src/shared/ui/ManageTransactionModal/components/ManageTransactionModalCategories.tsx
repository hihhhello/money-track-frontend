import { CategoryItem } from '@/shared/ui/Category/CategoryItem';
import { CategoryList } from '@/shared/ui/Category/CategoryList';
import { CategoryListLoading } from '@/shared/ui/Category/CategoryListLoading';

type ManageTransactionModalCategoriesProps = {
  isLoading?: boolean;
  handleAddNewCategory?: () => void;
  categories: Array<{ id: number; name: string }> | undefined;
  handleSelectCategoryId: (id: number | null) => void;
  selectedCategoryId: number | null;
};

export const ManageTransactionModalCategories = ({
  isLoading,
  handleAddNewCategory,
  categories,
  handleSelectCategoryId,
  selectedCategoryId,
}: ManageTransactionModalCategoriesProps) => {
  return (
    <div className="mb-4 flex min-h-[430px] flex-grow flex-col gap-2 overflow-y-hidden sm:min-h-[200px]">
      <span>Category</span>

      {isLoading ? (
        <CategoryListLoading handleAddNewCategory={handleAddNewCategory} />
      ) : (
        <CategoryList
          className="mb-2 p-2"
          wrapperClassName="overflow-y-hidden"
          handleAddNewCategory={handleAddNewCategory}
        >
          {categories?.map((category) => (
            <CategoryItem
              key={category.id}
              onClick={() => handleSelectCategoryId(category.id)}
              isSelected={selectedCategoryId === category.id}
            >
              {category.name}
            </CategoryItem>
          ))}
        </CategoryList>
      )}
    </div>
  );
};

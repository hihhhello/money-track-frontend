import { api } from '@/shared/api/api';
import { SquaresPlusIcon } from '@/shared/ui/Icons/SquaresPlusIcon';
import { Disclosure, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';

export const CategoriesDisclosure = () => {
  const { data: categories } = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  const reducedCategories = categories?.reduce(
    (categoriesAccumulator, category) => {
      if (category.type === 'deposit') {
        return {
          ...categoriesAccumulator,
          depositCategories: [...categoriesAccumulator.depositCategories],
        };
      }

      return {
        ...categoriesAccumulator,
        expenseCategories: [...categoriesAccumulator.expenseCategories],
      };
    },
    {
      depositCategories: [],
      expenseCategories: [],
    },
  );

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
        >
          <Disclosure.Panel className="">Content</Disclosure.Panel>
        </Transition>
      </Disclosure>
    </>
  );
};

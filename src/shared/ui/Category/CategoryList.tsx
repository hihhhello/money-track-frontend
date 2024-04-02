import { compact } from 'lodash';
import { useRef, useState, UIEvent } from 'react';
import { useMount } from 'react-use';
import { twMerge } from 'tailwind-merge';

import { PlusIcon } from '@/shared/icons/PlusIcon';

type CategoryListProps = {
  handleAddNewCategory?: () => void;
  wrapperClassName?: string;
} & JSX.IntrinsicElements['div'];

export const CategoryList = ({
  children,
  className,
  handleAddNewCategory,
  wrapperClassName,
  ...props
}: CategoryListProps) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollBottom, setCanScrollBottom] = useState(false);
  const [canScrollTop, setCanScrollTop] = useState(false);

  useMount(() => {
    if (!scrollableContainerRef.current) {
      return;
    }

    if (
      scrollableContainerRef.current?.scrollHeight >
      scrollableContainerRef.current?.clientHeight
    ) {
      setCanScrollBottom(true);
    }
  });

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 0) {
      setCanScrollTop(true);
    } else {
      setCanScrollTop(false);
    }

    if (e.currentTarget.scrollTop > 120) {
      setCanScrollBottom(false);
    } else {
      setCanScrollBottom(true);
    }
  };

  return (
    <div
      className={twMerge('flex flex-col items-start gap-4 ', wrapperClassName)}
    >
      <div
        className={twMerge(
          'grid h-full w-full gap-4 overflow-y-auto grid-cols-fit-50 sm:grid-cols-fit-100',
          className,
        )}
        ref={scrollableContainerRef}
        onScroll={handleScroll}
        style={{
          ...((canScrollBottom || canScrollTop) && {
            boxShadow: compact([
              canScrollBottom ? 'inset 0px -1em 1em -1em #00000024' : '',
              canScrollTop ? 'inset 0px 1em 1em -1em #00000024' : '',
            ]).join(','),
          }),
        }}
        {...props}
      >
        {children}
      </div>

      <div>
        {handleAddNewCategory && (
          <button
            type="button"
            onClick={handleAddNewCategory}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-main-blue text-main-white shadow-md hover:bg-main-blue/90"
          >
            <PlusIcon />
          </button>
        )}
      </div>
    </div>
  );
};

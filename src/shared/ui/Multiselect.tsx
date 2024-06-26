'use client';

import {
  Combobox,
  Transition,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import { Fragment, RefObject, useEffect, useRef, useState } from 'react';

/**
 * TODO: Move this function to the shared folder.
 */
function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !('nodeType' in e)) {
    throw new Error(`Node expected`);
  }
}

/**
 * TODO: Move this hook to the shared folder.
 */
/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      assertIsNode(event.target);

      if (ref?.current && !ref?.current.contains(event.target)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, ref]);
}

type MultiselectProps<TValue> = {
  value: TValue[];
  options: TValue[];
  handleChangeValue: (newValue: TValue[]) => void;
  getOptionLabel: (option: TValue) => string;
  getOptionKey: (option: TValue) => string | number;
};

export const Multiselect = <TValue,>({
  handleChangeValue,
  value,
  options,
  getOptionKey,
  getOptionLabel,
}: MultiselectProps<TValue>) => {
  const [searchTerm, setSearchTerm] = useState('');

  const comboboxRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchedOptions =
    searchTerm === ''
      ? options
      : options.filter((option) =>
          getOptionLabel(option)
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(searchTerm.toLowerCase().replace(/\s+/g, '')),
        );

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useOutsideAlerter(comboboxRef, () => {
    setIsMenuVisible(false);
  });

  return (
    <Combobox
      multiple
      value={value}
      onChange={handleChangeValue}
      ref={comboboxRef}
    >
      {() => (
        <div
          className="relative max-w-sm"
          onClick={() => {
            setIsMenuVisible(true);
            inputRef.current?.focus();
          }}
        >
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <div className="flex flex-wrap flex-1 pr-10">
              {value.map((selectedOption) => (
                <div
                  key={getOptionKey(selectedOption)}
                  className="flex items-center gap-1 bg-main-blue text-white rounded-full px-2 py-1 m-1"
                >
                  <span>{getOptionLabel(selectedOption)}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleChangeValue(
                        value.filter(
                          (option) =>
                            getOptionKey(option) !==
                            getOptionKey(selectedOption),
                        ),
                      )
                    }
                  >
                    <XCircleIcon className="h-6 w-6 text-white/25 hover:text-white/50" />
                    <span className="sr-only">
                      Remove {getOptionLabel(selectedOption)}
                    </span>
                  </button>
                </div>
              ))}

              <ComboboxInput
                className="border-none flex-1 py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Groups"
                onClick={() => setIsMenuVisible(true)}
                ref={inputRef}
              />
            </div>

            <ComboboxButton
              onClick={() => setIsMenuVisible(true)}
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setSearchTerm('')}
            show={isMenuVisible}
          >
            <ComboboxOptions
              static
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              {searchedOptions.length === 0 && searchTerm !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                searchedOptions.map((option) => (
                  <ComboboxOption
                    key={getOptionKey(option)}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-main-blue text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {getOptionLabel(option)}
                        </span>

                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-main-blue'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      )}
    </Combobox>
  );
};

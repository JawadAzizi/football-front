'use client';
import Choices from 'choices.js';
import React, { useState, useEffect, useRef } from 'react';
import 'choices.js/public/assets/styles/choices.min.css';

// Production-Ready Choices.js React Component
const AutoComplete = ({
  options = [],
  value = null,
  defaultValue = null,
  onChange = () => {},
  placeholder = 'Select an option',
  searchPlaceholder = 'Type to search',
  multiple = false,
  searchEnabled = true,
  removeItemButton = true,
  maxItemCount = -1,
  allowHTML = false,
  remoteSearch = false,
  onSearch = null,
  noResultsText = 'No results found',
  noChoicesText = 'No choices to choose from',
  disabled = false,
  className = '',
  loadingText = 'Loading...',
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const choicesInstance = useRef<Choices>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>(null);
  const hasInitialized = useRef(false);

  // Initialize Choices.js
  useEffect(() => {
    if (!selectRef.current || hasInitialized.current) return;

    const config = {
      searchEnabled,
      removeItemButton: multiple && removeItemButton,
      maxItemCount,
      placeholder: true,
      placeholderValue: placeholder,
      searchPlaceholderValue: searchPlaceholder,
      allowHTML,
      noResultsText,
      noChoicesText,
      shouldSort: false,
      itemSelectText: '',
      loadingText,
      searchResultLimit: 50,
      renderChoiceLimit: 50,
      silent: false,
    };

    try {
      // Initialize Choices.js (in production: new Choices(selectRef.current, config))
      const instance = new Choices(selectRef.current, config);
      choicesInstance.current = instance;
      hasInitialized.current = true;

      // Listen for change events
      selectRef.current.addEventListener('change', () => {
        if (multiple) {
          const selectedValues = instance.getValue(true);
          onChange(selectedValues);
        } else {
          const selectedValue = instance.getValue(true);
          onChange(selectedValue);
        }
      });

      // Listen for search events (remote search)
      if (remoteSearch && onSearch) {
        selectRef.current.addEventListener('search', async (event) => {
          const searchTerm = event.detail.value;

          if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
          }

          if (!searchTerm || searchTerm.length < 2) return;

          searchTimeout.current = setTimeout(async () => {
            setIsLoading(true);
            try {
              const results = await onSearch(searchTerm);
              if (choicesInstance.current) {
                choicesInstance.current.setChoices(results, 'value', 'label', true);
              }
            } catch (error) {
              console.error('Search error:', error);
            } finally {
              setIsLoading(false);
            }
          }, 300);
        });
      }
    } catch (error) {
      console.error('Error initializing Choices:', error);
    }

    return () => {
      if (choicesInstance.current) {
        try {
          choicesInstance.current.destroy();
          choicesInstance.current = null;
          hasInitialized.current = false;
        } catch (error) {
          console.error('Error destroying Choices:', error);
        }
      }
    };
  }, [
    options,
    defaultValue,
    multiple,
    searchEnabled,
    removeItemButton,
    maxItemCount,
    placeholder,
    searchPlaceholder,
    allowHTML,
    noResultsText,
    noChoicesText,
    loadingText,
    remoteSearch,
    onSearch,
  ]);

  // Update value when it changes externally
  useEffect(() => {
    if (choicesInstance.current && value !== null && value !== undefined) {
      try {
        if (multiple && Array.isArray(value)) {
          choicesInstance.current.removeActiveItems();
          choicesInstance.current.setChoiceByValue(value);
        } else if (!multiple) {
          choicesInstance.current.setChoiceByValue(value);
        }
      } catch (error) {
        console.error('Error setting value:', error);
      }
    }
  }, [value, multiple]);

  useEffect(() => {
    //Todo set options
    choicesInstance.current?.setChoices(options);
  }, [options]);

  return (
    <select
      ref={selectRef}
      multiple={multiple}
      disabled={disabled}
      className={`choices-select ${className}`}
    />
  );
};
export default AutoComplete;

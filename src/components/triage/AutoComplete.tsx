import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

interface IPropType {
  options: string[];
  handleSelection: (val: string) => void;
}

const AutoCompleteInput = (props: IPropType) => {
  const { options, handleSelection } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([""]);

  const getSuggestions = (inputValue: string) => {
    if (typeof inputValue !== "string") {
      return [];
    }
    const inputValueLowerCase = inputValue.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(inputValueLowerCase),
    );
  };

  // Debounce the onChange function
  const debouncedOnChange = debounce((newValue: string) => {
    setValue(newValue);
    setSuggestions(getSuggestions(newValue));
  }, 100); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

  const onSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    handleSelection(suggestion);
    setSuggestions([]);
  };

  const isSuggestionEmpty = () => {
    if (suggestions.length === 1 && suggestions[0] === "") {
      return true;
    } else return false;
  };

  // Add a click event listener to the document body to handle clicks outside of the component
  useEffect(() => {
    const handleDocumentClick = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        inputRef.current.blur();
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="w-full border border-dark text-black transition-all duration-300 rounded-md px-4 py-3 focus:outline-none"
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
        onFocus={() => {
          setSuggestions(options);
          setValue("");
        }}
      />
      {!isSuggestionEmpty() && suggestions.length > 0 && (
        <ul
          className="bg-white border-blue-500 border-2 rounded hover:cursor-pointer absolute top-14 w-full z-20 max-h-64 overflow-y-auto"
          onPointerLeave={() => {
            inputRef?.current?.blur();
            setSuggestions([""]);
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="hover:bg-blue-500 hover:text-white transition duration-200 text-sm text-gray-700 p-1"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;

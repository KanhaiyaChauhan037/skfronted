import { toast } from "react-toastify";
import { loadLocationOptions } from "./loadLocationOptions";
import fetcher from "./fetchWrapper";

export const loadOptions = async (queryName, inputValue) => {
  try {
    const response = await fetcher(
      `${process.env.NEXT_PUBLIC_HOST}/api/customers/filter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: {
            [queryName]: inputValue,
          },
          limit: 100,
          loadOptions: true,
        }),
      }
    );
    const data = await response.json();
    // remove the duplicates
    const uniqueOptions = new Set(
      data.filteredData.map((item) => item[queryName])
    );

    const formattedOptions = [...uniqueOptions].map((value) => ({
      value: value,
      label: value,
    }));
    return formattedOptions;
  } catch (error) {
    // console.error("Error fetching options:", error);
    toast.error("Something went wrong");
    return [];
  }
};

export function createDebouncedFunction(fn, delay = 250) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
export function excludeDebouncedFunction(fn, delay = 250) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const loadOptionsDebounced = createDebouncedFunction(
  (queryName, inputValue, callback) => {
    loadOptions(queryName, inputValue).then((options) => callback(options));
  },
  500
);
export const excludeOptionsDebounced = excludeDebouncedFunction(
  (queryName, inputValue, callback) => {
    loadOptions(queryName, inputValue).then((options) => callback(options));
  },
  500
);

export const includeLocationDebounced = createDebouncedFunction(
  (queryName, queryFields, inputValue, callback) => {
    loadLocationOptions(queryName, queryFields, inputValue).then((options) =>
      callback(options)
    );
  },
  500
);
export const excludeLocationDebounced = excludeDebouncedFunction(
  (queryName, queryFields, inputValue, callback) => {
    loadLocationOptions(queryName, queryFields, inputValue).then((options) =>
      callback(options)
    );
  },
  500
);

import { toast } from "react-toastify";
import fetcher from "./fetchWrapper";

export const loadLocationOptions = async (
  filterName,
  queryNames,
  inputValue
) => {
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
            [filterName]: [inputValue],            
          },
          limit : 100
        }),
      }
    );

    const data = await response.json();

    const filteredOptions = new Set();

    data.filteredData.forEach((item) => {
      queryNames.forEach((queryName) => {
        if (
          item.hasOwnProperty(queryName) &&
          item[queryName].toLowerCase().includes(inputValue.toLowerCase())
        ) {
          filteredOptions.add(item[queryName]);
        }
      });
    });

    const formattedOptions = [...filteredOptions].map((value) => ({
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

import { toast } from "react-toastify";
import { getDecryptedEmployee } from "./decrypt";
import fetcher from "./fetchWrapper";

export function filterExportHistory(datesValues) {
  const employee = getDecryptedEmployee();

  const url = `${process.env.NEXT_PUBLIC_HOST}/api/customers/export?employeeId=${employee?.id}`;

  return fetcher(url)
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      return response.json();
    })
    .then((historyWithFilters) => {
      // Filter and extract desired data based on datesValues
      const dateValuesFilters = historyWithFilters
        ?.filter((item) => item.createdDate === datesValues)
        .map((item) => item.filters);

      const selectedIds = historyWithFilters
        ?.filter((item) => item.createdDate === datesValues)
        .map((item) => item.selectedIds);

      // Return the filtered data
      return {
        dateValuesFilters,
        selectedIds,
      };
    })
    .catch((error) => {
      toast.error("Something went wrong");
      // console.error('Error:', error);
    });
}

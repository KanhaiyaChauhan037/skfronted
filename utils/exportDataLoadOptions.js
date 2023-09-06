import { components } from "react-select";
import { getDecryptedEmployee } from "./decrypt";
import fetcher from "./fetchWrapper";

const employee = getDecryptedEmployee();

const ExportDataLoadOptions = ({ children, ...props }) => {
  return (
    <components.Option {...props}>
      <div>Exported By : {employee?.name} </div>
      {children}
    </components.Option>
  );
};

export const loadOptionsExport = async (inputValue) => {
  const url = `${process.env.NEXT_PUBLIC_HOST}/api/customers/export?employeeId=${employee?.id}`;

  try {
    const response = await fetcher(url);
    if (response.ok) {
      const data = await response.json();
      // Process the data and create custom options

      const options = data.map((item) => {
        // Convert the date string to a Date object
        const date = new Date(item.createdDate);
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0
        let dd = date.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        // Get the hours and minutes from the Date object
        let hours = date.getHours();
        let minutes = date.getMinutes();

        // Determine if it's AM or PM
        const period = hours >= 12 ? "PM" : "AM";

        // Convert to 12-hour format
        hours = hours % 12 || 12;

        // Format the hours and minutes with leading zeros
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        const formattedTime = hours + ":" + minutes + " " + period;
        const formattedDate = dd + "/" + mm + "/" + yyyy;

        return {
          label: formattedDate + " " + formattedTime,
          value: item.createdDate,
        };
      });

      return options;
    }
    //  else {
    //   throw new Error("Failed to fetch data");
    // }
  } catch (error) {
    // console.error(error);
    toast.error("Something went wrong");
  }
};

export default ExportDataLoadOptions;

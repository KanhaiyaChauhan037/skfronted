import { toast } from "react-toastify";
import { getDecryptedEmployee } from "./decrypt";
import fetcher from "./fetchWrapper";

export const downloadResource = async (params, fileType, selectedIds) => {
  try {
    const employee = getDecryptedEmployee();
    const response = await toast.promise(
      fetcher(`${process.env.NEXT_PUBLIC_HOST}/api/customers/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: params,
          fileType,
          selectedIds,
          employee,
        }),
      }),
      {
        pending: "Preparing contacts to be downloaded...",
        error: "Failed to download contacts",
      }
    );
    if (response.ok) {
      toast.loading("Downloading file");
    }
    const fileData = await response.blob();

    if (fileData) {
      toast.dismiss();
      toast.success("File downloaded successfully");
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(fileData);
    downloadLink.download = `Sk Web Global.${fileType}`;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    // console.error(err);
    toast.error("Something went wrong");
  }
};

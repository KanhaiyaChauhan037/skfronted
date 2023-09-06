import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import fetcher from "@/utils/fetchWrapper";

function ImportExcel() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await toast.promise(
        fetcher(`${process.env.NEXT_PUBLIC_HOST}/api/customers/upload`, {
          method: "POST",
          body: formData,
        }),
        {
          pending: "Uploading...",
        }
      );

      if (response.ok) {
        toast.success("File uploaded successfully");
        // Handle success case if needed
      } else {
        // throw new Error("Failed to upload file");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
    }
    router.push("/records");
  };

  return (
    <>
      <div className="container vh-100 d-flex flex-column justify-content-center align-items-center ">
        <div className="card mb-5">
          <div className="card-header  ">
            <h4 className="card-title ">Upload Excel</h4>
          </div>
        </div>
        <div>
          <FontAwesomeIcon icon={faFileImport} fade size="2xl" />
        </div>

        <div className="container mt-5" style={{ maxWidth: "600px" }}>
          <div className="card bg-light p-4">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-8 mb-3 mb-sm-0">
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="form-control custom-file-input"
                        accept=".xlsx, .xls, .csv"
                        id="customFile"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-5 d-flex justify-content-center align-items-center">
                  <div className="col-xl-6 ">
                    <button
                      className="btn btn-primary btn-block"
                      type="button"
                      onClick={handleFileUpload}
                      disabled={!file || loading}
                    >
                      <i className="fas fa-upload me-1"></i>
                      Upload File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImportExcel;

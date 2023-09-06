import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import withAuthorization from "@/utils/withAuthorization";
import { useRouter } from "next/router";
import Script from "next/script";
import { useState } from "react";
import NoSSRWrapper from "@/components/NoSsr";
import { toast } from "react-toastify";
import fetcher from "@/utils/fetchWrapper";
import { getDecryptedEmployee } from "@/utils/decrypt";

const EditPassword = () => {
  const router = useRouter();
  const employee = getDecryptedEmployee();
  const _id = employee.id;

  const [user, setUser] = useState({
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const { password } = user;

  const updateEmployee = (id) => {
    fetcher(`${process.env.NEXT_PUBLIC_HOST}/api/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Update password failed");
        } else {
          toast.success("Password updated successfully");
        }
        return response.json();
      })

      .catch(() => {
        toast.error("Error updating password");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateEmployee(_id);
    router.back();
  };

  return (
    <>
      <NoSSRWrapper>
        <div className="nk-app-root">
          <div className="nk-main ">
            {/* sidebar @s */}
            <SideBar />
            {/* wrap @s */}
            <div className="nk-wrap ">
              <Header />
              <div className="nk-content ">
                <div className="container-fluid">
                  <div className="nk-content-inner">
                    <div className="nk-content-body">
                      <div className="components-preview wide-md mx-auto">
                        <div className="nk-block nk-block-lg">
                          <div className="nk-block-head">
                            <div className="nk-block-head-content">
                              <h3 className="title nk-block-title">
                                Edit Password
                              </h3>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-inner">
                              <form>
                                <div className="row g-4">
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        htmlFor="password"
                                      >
                                        New Password
                                      </label>
                                      <div className="form-control-wrap">
                                        <input
                                          type="password"
                                          name="password"
                                          className="form-control"
                                          id="password"
                                          value={user.password}
                                          onChange={handleChange}
                                          placeholder="Enter new password"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <button
                                        type="submit"
                                        className="btn btn-lg btn-primary"
                                        onClick={handleSubmit}
                                      >
                                        Update Password
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
      </NoSSRWrapper>
    </>
  );
};

export default withAuthorization(EditPassword, ["admin", "employee"]);

import Link from "next/link";
import { employeeActions } from "../store/loggedUserSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getDecryptedEmployee } from "@/utils/decrypt";

function Header() {
  const employee = getDecryptedEmployee();
  const dispatch = useDispatch();
  const router = useRouter();

  const userRole = employee ? employee.role : null;

  const initials = employee?.name.match(/\b\w/g).join("").toUpperCase();
  const capitalizeName =
    employee?.name.charAt(0).toUpperCase() + employee?.name.slice(1);

  const handleSignout = async (event) => {
    event.preventDefault();
    dispatch(employeeActions.employeeLogout());
    router.push("/");
  };

  const handlEditPassword = async (event) => {
    event.preventDefault();
    router.push(`/editPassword`);
  };

  return (
    <>
      <div className="nk-header nk-header-fixed is-light">
        <div className="container-fluid">
          <div className="nk-header-wrap">
            <div className="nk-menu-trigger d-xl-none ms-n1">
              <button
                type="button"
                className="nk-nav-toggle nk-quick-nav-icon"
                data-bs-toggle="offcanvas"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-expanded="false"
                aria-label="Toggle sidebar"
                style={{
                  color: "#9D72FF",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <em className="icon ni ni-menu" />
              </button>
            </div>

            <div className="nk-header-brand d-xl-none">
              <a
                href={userRole === "admin" ? "/admin/dashboard" : "/employee"}
                className="logo-link"
              >
                <img
                  className="logo-light logo-img"
                  src="/assets/images/logo.png"
                  srcSet="/assets/images/logo2x.png 2x"
                  alt="logo"
                />
                <img
                  className="logo-dark logo-img"
                  src="/assets/images/logo-dark.png"
                  srcSet="/assets/images/logo-dark2x.png 2x"
                  alt="logo-dark"
                />
              </a>
            </div>

            {/* .nk-header-news */}
            <div className="nk-header-tools">
              <ul className="nk-quick-nav">
                {/* .dropdown */}
                <li className="dropdown user-dropdown">
                  <Link
                    href="#"
                    className="dropdown-toggle me-n1"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-toggle">
                      <div className="user-avatar sm">
                        <em className="icon ni ni-user-alt" />
                      </div>
                      <div className="user-info d-none d-xl-block">
                        {employee ? (
                          <div className="user-status user-status-verified">
                            Verified
                          </div>
                        ) : (
                          <div className="user-status user-status-unverified">
                            Unverified
                          </div>
                        )}

                        <div className="user-name dropdown-indicator">
                          {capitalizeName}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-md dropdown-menu-end">
                    <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                      <div className="user-card">
                        <div className="user-avatar">
                          <span>{initials}</span>
                        </div>
                        <div className="user-info">
                          <span className="lead-text">{employee?.name}</span>
                          <span className="sub-text">
                            {employee?.email || ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-inner">
                      <ul className="link-list">
                        <li>
                          <Link href="#" onClick={handlEditPassword}>
                            <em className="icon ni ni-setting-alt" />
                            <span>Edit Password</span>
                          </Link>
                        </li>

                        <li>
                          <Link href="#" onClick={handleSignout}>
                            <em className="icon ni ni-signout" />
                            <span>Sign out</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* .nk-header-wrap */}
        </div>
        {/* .container-fliud */}
      </div>
    </>
  );
}

export default Header;

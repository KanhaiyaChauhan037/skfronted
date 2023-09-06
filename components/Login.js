import { loginEmployee } from "@/store/loggedUserSlice";
import { decryptData } from "@/utils/decrypt";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const encEmployee = useSelector((state) => state.loggedUserData?.employee);

  let employee = null;
  if (encEmployee && encEmployee.encryptedData) {
    employee = decryptData(encEmployee.encryptedData);
  }

  const router = useRouter();
  const dispatch = useDispatch();
  const { email, password } = user;

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return null;
    dispatch(loginEmployee({ email, password }));
  };

  useEffect(() => {
    if (employee) {
      router.push("/records");
    }
  }, [employee]);

  return (
    <>
      <div className="nk-app-root">
        {/* main @s */}
        <div className="nk-main ">
          {/* wrap @s */}
          <div className="nk-wrap nk-wrap-nosidebar">
            {/* content @s */}
            <div className="nk-content ">
              <div className="nk-split nk-split-page nk-split-lg">
                <div className="nk-split-content nk-block-area nk-block-area-column nk-auth-container bg-dark">
                  <div className="absolute-top-right d-lg-none p-3 p-sm-5">
                    <a
                      href="#"
                      className="toggle btn-white btn btn-icon btn-light"
                      data-target="athPromo"
                    >
                      <em className="icon ni ni-info" />
                    </a>
                  </div>
                  <div className="nk-block nk-block-middle nk-auth-body">
                    <div
                      className="brand-logo pb-5 "
                      style={{ paddingLeft: "100px" }}
                    >
                      {/* <div className="brand-logo pb-5"> */}
                      <a href="html/index.html" className="logo-link">
                        <img
                          className="logo-light logo-img custom-logo "
                          src="/assets/images/logo-white.png"
                          srcSet="/assets/images/logo-white.png 2x"
                          alt="logo"
                        />
                        <img
                          className="logo-dark custom-logo "
                          src="/assets/images/logo-white.png"
                          srcSet="/assets/images/logo-white.png 2x"
                          alt="logo-dark"
                        />
                      </a>
                      {/* <a href="html/index.html" className="logo-link">
                        <img
                          className="logo-light logo-img logo-img-lg"
                          src="/assets/images/logo-white.png"
                          srcSet="/assets/images/logo-white.png 2x"
                          alt="logo"
                        />
                        <img
                          className="logo-dark logo-img logo-img-lg"
                          src="/assets/images/logo-white.png"
                          srcSet="/assets/images/logo-white.png 2x"
                          alt="logo-dark"
                        />
                      </a> */}
                    </div>
                    <div className="nk-block-head">
                      <div className="nk-block-head-content">
                        <h5 className="nk-block-title text-white">Sign-In</h5>
                        <div className="nk-block-des text-white">
                          <p>
                            Access the Sk Web Global panel using your email and
                            passcode.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* .nk-block-head */}
                    <form
                      onSubmit={handleSubmit}
                      className="form-validate is-alter"
                      autoComplete="off"
                    >
                      {/* .form-group */}
                      <div className="form-group">
                        <div className="form-label-group">
                          <label
                            className="form-label text-white"
                            htmlFor="email-address"
                          >
                            Email
                          </label>
                        </div>
                        <div className="form-control-wrap">
                          <input
                            autoComplete="off"
                            type="text"
                            name="email"
                            className="form-control form-control-lg"
                            required=""
                            id="email-address"
                            placeholder="Enter your email address or username"
                            value={email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* .form-group */}
                      <div className="form-group">
                        <div className="form-label-group">
                          <label
                            className="form-label text-white"
                            htmlFor="password"
                          >
                            Passcode
                          </label>
                        </div>
                        <div className="form-control-wrap">
                          <a
                            tabIndex={-1}
                            href="#"
                            className="form-icon form-icon-right passcode-switch lg"
                            data-target="password"
                          ></a>
                          <input
                            autoComplete="new-password"
                            type="password"
                            name="password"
                            className="form-control form-control-lg"
                            required=""
                            id="password"
                            placeholder="Enter your passcode"
                            value={password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* .form-group */}
                      <div className="form-group">
                        <button
                          className="btn btn-lg btn-dark btn-block"
                          type="submit"
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                    {/* form */}
                  </div>
                </div>
                {/* .nk-split-content */}
                <div
                  className="nk-split-content nk-split-stretch"
                  data-toggle-body="true"
                  data-content="athPromo"
                  data-toggle-screen="lg"
                  data-toggle-overlay="true"
                  style={{ backgroundColor: "#9F3939" }}
                >
                  <div className="login_content d-flex flex-column align-items-center">
                    <h3 className="pt-5 text-center" style={{ color: "white" }}>
                      Leads Database with 200 million contacts Highest Accuracy
                      &amp; Lowest Prices
                    </h3>
                    <img
                      src="/assets/images/lead-generation.png"
                      className="login_img bounce"
                    />
                    <h3 className="text-center" style={{ color: "white" }}>
                      Trusted by 1,000 + global brands worldwide
                    </h3>
                  </div>
                  {/* <div className="slider-wrap w-100 p-3 p-sm-5 m-auto mar_auto">
                    <div className="slider-init login_slider">
                      <div className="slider-item">
                        <div className="nk-feature nk-feature-center">
                          <div className="nk-feature-img">
                            <img
                              className="round"
                              src="/assets/images/adobe.png"
                              srcSet="/assets/images/adobe.png 2x"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    
                      <div className="slider-item">
                        <div className="nk-feature nk-feature-center">
                          <div className="nk-feature-img">
                            <img
                              className="round"
                              src="/assets/images/aws.png"
                              srcSet="/assets/images/aws.png 2x"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="slider-item">
                        <div className="nk-feature nk-feature-center">
                          <div className="nk-feature-img">
                            <img
                              className="round"
                              src="/assets/images/interbrand.png"
                              srcSet="/assets/images/interbrand.png 2x"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    
                      <div className="slider-item">
                        <div className="nk-feature nk-feature-center">
                          <div className="nk-feature-img">
                            <img
                              className="round"
                              src="/assets/images/salesforce.png"
                              srcSet="/assets/images/salesforce.png 2x"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    
                    </div>
                  
                    <div className="slider-dots" />
                    <div className="slider-arrows" />
                  </div> */}
                  {/* .slider-wrap */}
                </div>
                {/* .nk-split-content */}
              </div>
              {/* .nk-split */}
            </div>
            {/* wrap @e */}
          </div>
          {/* content @e */}
        </div>
        {/* main @e */}
      </div>
      <style jsx>
        {`
          .custom-input {
            max-width: 200px;
          }
          .custom-logo {
            height: 100px;
            width: auto;
          }
        `}
      </style>
    </>
  );
}

export default Login;

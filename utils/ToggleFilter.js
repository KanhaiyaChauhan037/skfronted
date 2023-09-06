import React, { useState } from "react";

const ToggleFilter = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="toggle-menu-wrapper">
        <div className="toggle-menu-container">
          <div className="button-wrapper" onClick={handleToggle}>
            <span className="button-text">{title}</span>

            {isOpen ? (
              <span>
                <em
                  className="icon ni ni-chevron-up"
                  style={{ fontSize: "1.3rem" }}
                ></em>
              </span>
            ) : (
              <span>
                <em
                  className="icon ni ni-chevron-down"
                  style={{ fontSize: "1.3rem" }}
                ></em>
              </span>
            )}
          </div>

          {isOpen && <div className="mt-3 ">{children}</div>}
        </div>
      </div>
      <style jsx>{`
        .toggle-menu-wrapper {
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 10px;
          width: 100%;
          max-width: 300px;
          margin-bottom: 10px;
          display: inline-block;
        }

        .toggle-menu-container {
          position: relative;
        }

        .button-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
        }

        .dropdown-menu {
          /* position: absolute;
          top: 100%;
          left: 0; */
          /* display: block; */
          /* width: 100%; */
          /* background-color: white; */
          border: 1px solid #ccc;
          /* padding: 10px; */
          /* border-radius: 4px; */
          /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
        }

        .button-text {
          font-size: 14px;
          margin-left: 0.5rem;
        }
        .small-icon {
          font-size: 0.8rem;
        }
      `}</style>
    </>
  );
};

export default ToggleFilter;

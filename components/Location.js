import { useState } from "react";
import ToggleMenu from "./toggleMenu";
import AsyncSelect from "react-select/async";
import {
  excludeLocationDebounced,
  includeLocationDebounced,
} from "@/utils/loadOptions";

const Location = ({ updateSelectedOptions, selectedOptions }) => {
  const [activeTab, setActiveTab] = useState("contact");
  const { options } = selectedOptions;

  function transformOptionsArray(optionsArray) {
    if (Array.isArray(optionsArray)) {
      return optionsArray.map((value) => ({
        value,
        label: value,
      }));
    }
    return [];
  }

  const valueCompanyLocation = transformOptionsArray(options.companylocation);
  const valueContactLocation = transformOptionsArray(options.contactlocation);
  const valueExcludeCompanyLoc = transformOptionsArray(
    options.excludeCompanyLoc
  );
  const valueExcludeContactLoc = transformOptionsArray(
    options.excludeContactLoc
  );

  return (
    <>
      <ToggleMenu title="Location" icon="icon ni ni-list-thumb">
        <ul className="nav nav-underline justify-content-center pb-4">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
              href="#"
            >
              <strong style={{ fontWeight: "bold", letterSpacing: "1px" }}>
                Contact
              </strong>
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === "accountHQ" ? "active" : ""
              }`}
              onClick={() => setActiveTab("accountHQ")}
              href="#"
            >
              <strong style={{ fontWeight: "bold", letterSpacing: "1px" }}>
                Account HQ
              </strong>
            </a>
          </li>
        </ul>

        {activeTab === "contact" && (
          <div>
            <p>Include contact locations</p>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              name="contactlocation"
              loadOptions={(inputValue, callback) =>
                includeLocationDebounced(
                  "contactlocation",
                  ["city", "state", "country"],
                  inputValue,
                  callback
                )
              }
              value={valueContactLocation}
              onChange={(value) => {
                updateSelectedOptions("contactlocation", value);
              }}
              isSearchable
            ></AsyncSelect>
            <p>Exclude contact locations</p>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              name="excludeContactLoc"
              value={valueExcludeContactLoc}
              loadOptions={(inputValue, callback) =>
                excludeLocationDebounced(
                  "contactlocation",
                  ["city", "state", "country"],
                  inputValue,
                  callback
                )
              }
              onChange={(value) =>
                updateSelectedOptions("excludeContactLoc", value)
              }
              isSearchable
            ></AsyncSelect>
          </div>
        )}

        {activeTab === "accountHQ" && (
          <div>
            <p>Include company locations</p>
            <AsyncSelect
              isMulti
              isClearable
              cacheOptions
              defaultOptions
              name="companylocation"
              value={valueCompanyLocation}
              loadOptions={(inputValue, callback) =>
                includeLocationDebounced(
                  "companylocation",
                  ["companycity", "companystate", "companycountry"],
                  inputValue,
                  callback
                )
              }
              onChange={(value) =>
                updateSelectedOptions("companylocation", value)
              }
              isSearchable
            ></AsyncSelect>
            <p>Exclude company locations</p>
            <AsyncSelect
              isMulti
              isClearable
              cacheOptions
              defaultOptions
              name="excludeCompanyLoc"
              value={valueExcludeCompanyLoc}
              loadOptions={(inputValue, callback) =>
                excludeLocationDebounced(
                  "companylocation",
                  ["companycity", "companystate", "companycountry"],
                  inputValue,
                  callback
                )
              }
              onChange={(value) =>
                updateSelectedOptions("excludeCompanyLoc", value)
              }
              isSearchable
            ></AsyncSelect>
          </div>
        )}

        {activeTab !== "contact" && activeTab !== "accountHQ" && null}
      </ToggleMenu>
      <style>
        {`
            .nav-underline .nav-link.active::after {
              position: absolute;
              content: "";
              width: 100%;
              height: 2px;
              background-color: #000; 
              bottom: 0;
              left: 0;
            }
          `}
      </style>
    </>
  );
};

export default Location;

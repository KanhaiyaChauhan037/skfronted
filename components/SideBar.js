import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Script from "next/script";
import ToggleMenu from "./toggleMenu";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { setQueryData } from "@/store/queryDataSlice";
import InputOption from "./InputOptionCheckbox";
import treeData from "./data";
import { TreeSelect } from "antd";
import {
  addSelectedNode,
  removeSelectedNode,
  setSelectedOptions,
  setValue,
  updateSelectedData,
} from "@/store/selectedOptionsSlice";
import {
  excludeOptionsDebounced,
  loadOptionsDebounced,
} from "@/utils/loadOptions";
import {
  emailStatusOptions,
  employeeRangeOptions,
  managementLevels,
  phoneStatusOptions,
  // revenueOptions,
} from "@/utils/manualCheckboxOptions";
import Location from "./Location";
import { transformValue } from "@/utils/transformValue";
import { getDecryptedEmployee } from "@/utils/decrypt";

function SideBar() {
  const employee = getDecryptedEmployee();
  const { SHOW_PARENT } = TreeSelect;
  const dispatch = useDispatch();
  const options = [];
  const formatCreateLabel = (inputValue) => `Search... ${inputValue}`;

  const selectedOptions = useSelector((state) => state.selectedOptions);
  const selectedData = useSelector(
    (state) => state.selectedOptions.selectedData
  );
  const value = useSelector((state) => state.selectedOptions.value);
  const selectedNodes = useSelector(
    (state) => state.selectedOptions.selectedNodes
  );
  const userRole = employee ? employee.role : null;

  // Update selected options for a specific query
  const updateSelectedOptions = (queryName, value) => {
    dispatch(setSelectedOptions({ queryName, value }));

    const arrayOfValues = (Array.isArray(value) ? value : [value]).map(
      (option) => option && option.value
    );
    dispatch(setQueryData({ name: queryName, value: arrayOfValues })); // query data to export
  };

  //Dept and Job function
  const valueMap = {};
  function loops(list, parent) {
    return (list || []).map(({ children, value }) => {
      const node = (valueMap[value] = {
        parent,
        value,
      });
      node.children = loops(children, node);
      return node;
    });
  }

  loops(treeData);
  function getPath(value) {
    const path = [];
    let current = valueMap[value];
    while (current) {
      path.unshift(current.value);
      current = current.parent;
    }
    return path;
  }

  const onSelectHandler = (value, node) => {
    dispatch(addSelectedNode({ value, node }));
  };
  const onDeselectHandler = (value) => {
    dispatch(removeSelectedNode(value));
  };
  const onChange = (value) => {
    dispatch(setValue(value));
  };
  const tProps = {
    treeData,
    value,
    onChange,
    onSelect: onSelectHandler,
    onDeselect: onDeselectHandler,
    placement: "bottomLeft",
    filterTreeNode: true,
    treeNodeFilterProp: "title",
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    listHeight: 400,
    style: {
      width: "100%",
    },
  };

  useEffect(() => {
    const updatedSelectedData = [];

    selectedNodes?.forEach((selectedNode) => {
      const { value, node } = selectedNode;
      const path = getPath(value);
      const departmentName = path[0];
      const titles = [];

      if (path.length > 1) {
        // Selected a child node
        titles.push(path[1] || "");
      } else {
        // Selected a parent node
        titles.push(...node.children?.map((child) => child.value));
      }

      updatedSelectedData.push({
        departmentName,
        titles,
      });
    });
    dispatch(updateSelectedData(updatedSelectedData));
  }, [dispatch, selectedNodes]);

  //export queryData for jobfunction
  useEffect(() => {
    dispatch(setQueryData({ name: "jobfunction", value: selectedData }));
  }, [selectedData, dispatch]);

  const { options: selectedValues } = selectedOptions;

  let isXlScreen = false;
  if (typeof window !== "undefined") {
    isXlScreen = window.innerWidth <= 1200;
  }
  const canvasClassName = isXlScreen
    ? "offcanvas offcanvas-start"
    : "nk-sidebar nk-sidebar-fixed is-light";

  const predefinedRange = (value) => {
    if (value) {
      const [min, max] = value.value.split("-");
      updateSelectedOptions("minEmployeeCount", { value: min, label: min });
      updateSelectedOptions("maxEmployeeCount", { value: max, label: max });
    } else if (
      selectedValues?.minEmployeeCount?.length > 0 &&
      selectedValues?.maxEmployeeCount?.length > 0
    ) {
      // Clear the selected options for minEmployeeCount and maxEmployeeCount
      updateSelectedOptions("minEmployeeCount", null);
      updateSelectedOptions("maxEmployeeCount", null);
    }
  };

  const [selectedRange, setSelectedRange] = useState("predefined");

  const handleRadioChange = (event) => {
    setSelectedRange(event.target.value);
    if (
      selectedValues?.minEmployeeCount &&
      selectedValues?.maxEmployeeCount &&
      (selectedValues?.minEmployeeCount[0] !== undefined ||
        selectedValues?.maxEmployeeCount[0] !== undefined)
    ) {
      updateSelectedOptions("minEmployeeCount", null);
      updateSelectedOptions("maxEmployeeCount", null);
    }
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      width: "90%",
    }),
  };

  return (
    <>
      {/* sidebar @s */}

      <div
        className={canvasClassName}
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="nk-sidebar-element nk-sidebar-head btn-primary offcanvas-header ">
          <div className="nk-sidebar-brand">
            <a
              href={userRole === "admin" ? "/admin/dashboard" : "/employee"}
              className="logo-link nk-sidebar-logo"
            >
              {/* <img
                className="logo-light logo-img"
                src="/assets/images/logo.png"
                srcSet="/assets/images/logo2x.png 2x"
                alt="logo"
              /> */}
              <img
                className="logo-dark logo-img"
                src="/assets/images/logo-dark.png"
                srcSet="/assets/images/logo-dark2x.png 2x"
                alt="logo-dark"
              />
              {/* <img
                className="logo-small logo-img logo-img-small"
                src="/assets/images/logo-small.png"
                srcSet="/assets/images/logo-small2x.png 2x"
                alt="logo-small"
              /> */}
              <span
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                SK WEB GLOBAL
              </span>
            </a>
          </div>
          <div className="nk-menu-trigger me-n2">
            <a
              href="#"
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
            >
              <em className="icon ni ni-arrow-left" />
            </a>
          </div>
        </div>
        {/* .nk-sidebar-element */}
        <div className="nk-sidebar-element offcanvas-body">
          <div className="nk-sidebar-content">
            <div className="nk-sidebar-menu" data-simplebar="">
              <ul className="nk-menu">
                {/* .nk-menu-item */}
                <li className="nk-menu-heading">
                  <h6 className="overline-title text-primary-alt">
                    Dashboards
                  </h6>
                </li>
                {/* .nk-menu-item */}
                <li className="nk-menu-item">
                  <Link
                    href={
                      userRole === "admin" ? "/admin/dashboard" : "/employee"
                    }
                    className="nk-menu-link"
                  >
                    <span className="nk-menu-icon">
                      <em className="icon ni ni-grid-alt-fill" />
                    </span>
                    <span className="nk-menu-text">Dashboard</span>
                  </Link>
                </li>

                {userRole === "admin" && (
                  <>
                    <li className="nk-menu-item">
                      <Link
                        href="/admin/employee-list"
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-icon">
                          <em className="icon ni ni-cart-fill" />
                        </span>
                        <span className="nk-menu-text">Employees</span>
                      </Link>
                    </li>
                    <li className="nk-menu-item">
                      <Link href="/admin/excel" className="nk-menu-link">
                        <span className="nk-menu-icon">
                          <em className="icon ni ni-activity-round-fill" />
                        </span>
                        <span className="nk-menu-text">Excel</span>
                      </Link>
                    </li>
                  </>
                )}

                {/* .nk-menu-item */}
                <li className="nk-menu-item">
                  <Link href="/records" className="nk-menu-link">
                    <span className="nk-menu-icon">
                      <em className="icon ni ni-growth-fill" />
                    </span>
                    <span className="nk-menu-text">Leads</span>
                  </Link>
                </li>
                {/* .nk-menu-item */}
                <li className="nk-menu-heading">
                  <h6 className="overline-title text-primary-alt">Filters</h6>
                </li>

                <ToggleMenu title="Name" icon="icon ni ni-users-fill">
                  <CreatableSelect
                    isClearable
                    options={options}
                    formatCreateLabel={formatCreateLabel}
                    name="name"
                    value={transformValue(selectedValues?.name)}
                    noOptionsMessage={() => null}
                    components={{ DropdownIndicator: null }}
                    placeholder="e.g. Bill, John"
                    onChange={(value) => updateSelectedOptions("name", value)}
                  />
                </ToggleMenu>
                <ToggleMenu title="Job Titles" icon="icon ni ni-users-fill">
                  <p>Include List of Titles </p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="title"
                    value={transformValue(selectedValues?.title)}
                    loadOptions={(inputValue, callback) =>
                      loadOptionsDebounced("title", inputValue, callback)
                    }
                    onChange={(value) => updateSelectedOptions("title", value)}
                    isSearchable
                  ></AsyncSelect>
                  <p>Exclude List of Titles </p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="excTitle"
                    value={transformValue(selectedValues?.excTitle)}
                    loadOptions={(inputValue, callback) =>
                      excludeOptionsDebounced("title", inputValue, callback)
                    }
                    onChange={(value) =>
                      updateSelectedOptions("excTitle", value)
                    }
                    isSearchable
                  ></AsyncSelect>
                  <div className="nk-menu-item ">Management Level</div>
                  <Select
                    defaultValue={[]}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    value={transformValue(selectedValues?.seniority)}
                    placeholder="Management"
                    options={managementLevels}
                    name="seniority"
                    onChange={(value) =>
                      updateSelectedOptions("seniority", value)
                    }
                    components={{
                      Option: InputOption,
                    }}
                  />
                  <div className="nk-menu-item ">
                    Departments & Job function
                  </div>

                  <TreeSelect showSearch {...tProps} />
                </ToggleMenu>

                <ToggleMenu title="Company" icon="icon ni ni-list-thumb">
                  <p>Include list of companies</p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="company"
                    value={transformValue(selectedValues?.company)}
                    loadOptions={(inputValue, callback) =>
                      loadOptionsDebounced("company", inputValue, callback)
                    }
                    onChange={(value) =>
                      updateSelectedOptions("company", value)
                    }
                    isSearchable
                  ></AsyncSelect>
                  <p>Exclude list of companies</p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="excComp"
                    value={transformValue(selectedValues?.excComp)}
                    loadOptions={(inputValue, callback) =>
                      excludeOptionsDebounced("company", inputValue, callback)
                    }
                    onChange={(value) =>
                      updateSelectedOptions("excComp", value)
                    }
                    isSearchable
                  ></AsyncSelect>
                </ToggleMenu>

                <Location
                  updateSelectedOptions={updateSelectedOptions}
                  selectedOptions={selectedOptions}
                />

                <ToggleMenu title="# Employees" icon="icon ni ni-cc-alt2-fill">
                  <div className="form-check ms-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      // name="flexRadioDefault1"
                      // id="flexRadioDefault1"
                      value="predefined"
                      checked={selectedRange === "predefined"}
                      onChange={handleRadioChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Predefined Range
                    </label>
                  </div>
                  <div className="form-check ms-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      // name="flexRadioDefault2"
                      // id="flexRadioDefault2"
                      value="custom"
                      checked={selectedRange === "custom"}
                      onChange={handleRadioChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Custom Range
                    </label>
                  </div>
                  {selectedRange === "predefined" && (
                    <div className="row p-2">
                      <Select
                        defaultValue={[]}
                        isClearable
                        // defaultMenuIsOpen
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        // value={transformValue(selectedValues?.predefinedRange)}
                        placeholder="Predefined Range"
                        options={employeeRangeOptions}
                        name="predefinedRange"
                        onChange={(value) =>
                          // updateSelectedOptions("seniority", value)
                          predefinedRange(value)
                        }
                        components={{
                          Option: InputOption,
                        }}
                        styles={customStyles}
                      />
                    </div>
                  )}

                  {selectedRange === "custom" && (
                    <div className="row p-2">
                      <div className="col">
                        <CreatableSelect
                          isClearable
                          options={options}
                          formatCreateLabel={formatCreateLabel}
                          name="minEmployeeCount"
                          value={transformValue(
                            selectedValues?.minEmployeeCount
                          )}
                          noOptionsMessage={() => null}
                          components={{ DropdownIndicator: null }}
                          placeholder="Min"
                          onChange={(value) =>
                            updateSelectedOptions("minEmployeeCount", value)
                          }
                        />
                      </div>
                      <div className="col">
                        <CreatableSelect
                          isClearable
                          options={options}
                          formatCreateLabel={formatCreateLabel}
                          name="maxEmployeeCount"
                          value={transformValue(
                            selectedValues?.maxEmployeeCount
                          )}
                          noOptionsMessage={() => null}
                          components={{ DropdownIndicator: null }}
                          placeholder="Max"
                          onChange={(value) =>
                            updateSelectedOptions("maxEmployeeCount", value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </ToggleMenu>
                <ToggleMenu title="Industry" icon="icon ni ni-grid-alt-fill">
                  <p>Include List of Industries </p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="industry"
                    value={transformValue(selectedValues?.industry)}
                    loadOptions={(inputValue, callback) =>
                      loadOptionsDebounced("industry", inputValue, callback)
                    }
                    onChange={(value) =>
                      updateSelectedOptions("industry", value)
                    }
                    isSearchable
                  ></AsyncSelect>
                  <p>Exclude List of Industries</p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="excInd"
                    value={transformValue(selectedValues?.excInd)}
                    loadOptions={(inputValue, callback) =>
                      excludeOptionsDebounced("industry", inputValue, callback)
                    }
                    onChange={(value) => updateSelectedOptions("excInd", value)}
                    isSearchable
                  ></AsyncSelect>
                </ToggleMenu>
                <ToggleMenu title="Keywords" icon="icon ni ni-file-docs">
                  <p>Include List of Keywords </p>
                  <CreatableSelect
                    isMulti
                    options={options}
                    formatCreateLabel={formatCreateLabel}
                    name="keywords"
                    value={transformValue(selectedValues?.keywords)}
                    noOptionsMessage={() => null}
                    components={{ DropdownIndicator: null }}
                    placeholder="e.g. Tech, finance"
                    onChange={(value) =>
                      updateSelectedOptions("keywords", value)
                    }
                  />

                  <p>Exclude List of Keywords</p>

                  <CreatableSelect
                    isMulti
                    options={options}
                    formatCreateLabel={formatCreateLabel}
                    name="exckeywords"
                    value={transformValue(selectedValues?.exckeywords)}
                    noOptionsMessage={() => null}
                    components={{ DropdownIndicator: null }}
                    placeholder="Exclude keywords"
                    onChange={(value) =>
                      updateSelectedOptions("exckeywords", value)
                    }
                  />
                </ToggleMenu>
                <ToggleMenu title="Email Status" icon="icon ni ni-users-fill">
                  <div className="nk-menu-item ">Buisness Email Status</div>
                  <Select
                    defaultValue={[]}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    value={transformValue(selectedValues?.emailstatus)}
                    options={emailStatusOptions}
                    name="emailstatus"
                    onChange={(value) =>
                      updateSelectedOptions("emailstatus", value)
                    }
                    components={{
                      Option: InputOption,
                    }}
                  />
                </ToggleMenu>
                <ToggleMenu title="Phone Status" icon="icon ni ni-users-fill">
                  <div className="nk-menu-item ">Phone Number Status</div>
                  <Select
                    defaultValue={[]}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    value={transformValue(selectedValues?.phonestatus)}
                    options={phoneStatusOptions}
                    name="phonestatus"
                    onChange={(value) =>
                      updateSelectedOptions("phonestatus", value)
                    }
                    components={{
                      Option: InputOption,
                    }}
                  />
                </ToggleMenu>
                <ToggleMenu
                  title="Technologies"
                  icon="icon ni ni-grid-alt-fill"
                >
                  <p>Include List of Technologies </p>
                  <CreatableSelect
                    isMulti
                    options={options}
                    formatCreateLabel={formatCreateLabel}
                    name="technologies"
                    value={transformValue(selectedValues?.technologies)}
                    noOptionsMessage={() => null}
                    components={{ DropdownIndicator: null }}
                    placeholder="e.g. Cloud, AWS"
                    onChange={(value) =>
                      updateSelectedOptions("technologies", value)
                    }
                  />

                  <p>Exclude List of Technologies</p>
                  <CreatableSelect
                    isMulti
                    options={options}
                    formatCreateLabel={formatCreateLabel}
                    name="excTech"
                    value={transformValue(selectedValues?.excTech)}
                    noOptionsMessage={() => null}
                    components={{ DropdownIndicator: null }}
                    placeholder="Exclude Technologies"
                    onChange={(value) =>
                      updateSelectedOptions("excTech", value)
                    }
                  />
                </ToggleMenu>
                {/* <ToggleMenu title="Revenue" icon="icon ni ni-view-col">
                  <div className="row px-2">
                    <div className="col">
                      <Select
                        isClearable
                        options={revenueOptions}
                        name="minRevenue"
                        value={transformRevenueValue(
                          selectedValues?.minRevenue
                        )}
                        placeholder="Min"
                        onChange={(value) =>
                          updateSelectedOptions("minRevenue", value)
                        }
                      />
                    </div>
                  </div>
                  <div className="row pt-2 px-2">
                    <div className="col">
                      <Select
                        isClearable
                        options={revenueOptions}
                        name="maxRevenue"
                        value={transformRevenueValue(
                          selectedValues?.maxRevenue
                        )}
                        placeholder="Max"
                        onChange={(value) =>
                          updateSelectedOptions("maxRevenue", value)
                        }
                      />
                    </div>
                  </div>
                </ToggleMenu>
                <ToggleMenu title="Funding" icon="icon ni ni-cc-alt2-fill">
                  <div className="row px-2">
                    <div className="col">
                      <Select
                        isClearable
                        options={revenueOptions}
                        name="mintotalfunding"
                        value={transformRevenueValue(
                          selectedValues?.mintotalfunding
                        )}
                        placeholder="Min"
                        onChange={(value) =>
                          updateSelectedOptions("mintotalfunding", value)
                        }
                      />
                    </div>
                  </div>
                  <div className="row pt-2 px-2">
                    <div className="col">
                      <Select
                        isClearable
                        options={revenueOptions}
                        name="maxtotalfunding"
                        value={transformRevenueValue(
                          selectedValues?.maxtotalfunding
                        )}
                        placeholder="Max"
                        onChange={(value) =>
                          updateSelectedOptions("maxtotalfunding", value)
                        }
                      />
                    </div>
                  </div>
                </ToggleMenu> */}
                <ToggleMenu title="SIC Codes" icon="icon ni ni-grid-alt-fill">
                  <p>Include List of SIC Codes </p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="siccodes"
                    value={transformValue(selectedValues?.siccodes)}
                    loadOptions={(inputValue, callback) =>
                      loadOptionsDebounced("siccodes", inputValue, callback)
                    }
                    onChange={(value) =>
                      updateSelectedOptions("siccodes", value)
                    }
                    isSearchable
                  ></AsyncSelect>
                  <p>Exclude List of SIC Codes </p>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    name="excSiccodes"
                    value={transformValue(selectedValues?.excSiccodes)}
                    loadOptions={(inputValue, callback) =>
                      excludeOptionsDebounced("siccodes", inputValue, callback)
                    }
                    onChange={(value) =>
                      updateSelectedOptions("excSiccodes", value)
                    }
                    isSearchable
                  ></AsyncSelect>
                </ToggleMenu>
              </ul>

              {/* .nk-menu */}
            </div>

            {/* .nk-sidebar-menu */}
          </div>

          {/* .nk-sidebar-content */}
        </div>

        {/* .nk-sidebar-element */}
      </div>

      <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
      {/* <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script> */}
      <style jsx>
        {`
          .custom-logo {
            height: 50px;
            width: 50px;
          }
          #sidebarMenu {
            width: 290px;
          }
        `}
      </style>
    </>
  );
}

export default SideBar;

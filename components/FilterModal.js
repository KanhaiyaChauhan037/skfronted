import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import ToggleFilter from "@/utils/ToggleFilter";
import { setQueryData } from "@/store/queryDataSlice";
import { useDispatch, useSelector } from "react-redux";
import InputOption from "./InputOptionCheckbox";
import treeData from "./data";
import { TreeSelect } from "antd";
import {
  clearAllSelectedOptions,
  getSelectedIds,
  setSelectedOptions,
  setValue,
  updateEmployeesByDeptData,
  updateSelectedData,
} from "@/store/selectedOptionsSlice";
import {
  excludeLocationDebounced,
  excludeOptionsDebounced,
  includeLocationDebounced,
  loadOptionsDebounced,
} from "@/utils/loadOptions";
import {
  emailStatusOptions,
  employeeRangeOptions,
  fundingTypeOptions,
  managementLevels,
  phoneStatusOptions,
  revenueOptions,
} from "@/utils/manualCheckboxOptions";
import { clearSelectedByDept } from "@/store/selectedByDeptSlice";

import ExportDataLoadOptions, {
  loadOptionsExport,
} from "@/utils/exportDataLoadOptions";
import { filterExportHistory } from "@/utils/filterExportHistory";
import EmployeesByDept from "./EmployeesByDept";

function FilterModal(props) {
  const { showModal, onContactreqChange, selectedContactreq } = props;
  const { SHOW_PARENT } = TreeSelect;
  const options = [];
  const dispatch = useDispatch();
  const formatCreateLabel = (inputValue) => `Search... ${inputValue}`;
  // const selectedOptions = useSelector((state) => state.selectedOptions);
  const [selectedOptionsTemp, setSelectedOptionsTemp] = useState({});

  const [selectedNodes, setSelectedNodes] = useState([]);

  // const [valueByDept, setValueByDept] = useState();
  const [employeeOptionsByDept, setEmployeeOptionsByDept] = useState({});
  const [valueByDept, setValueByDept] = useState("");
  // const [selectedContactreq, setselectedContactreq] = useState(null);
  // const onChangeByDept = (newValue, selectedNodes) => {
  //   setValueByDept(newValue);
  // };
  // const selectedOptionsByDept = useSelector(
  //   (state) => state.selectedByDept.selectedOptionsByDept
  // );
  // const historyWithFilters = useSelector(
  //   (state) => state.exportHistory.historyWithFilters
  // );

  // dept and job function
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
    const selectedNode = {
      value,
      node,
    };
    setSelectedNodes((prevSelectedNodes) => [
      ...prevSelectedNodes,
      selectedNode,
    ]);
  };

  const onDeselectHandler = (value) => {
    setSelectedNodes((prevSelectedNodes) =>
      prevSelectedNodes.filter((selectedNode) => selectedNode.value !== value)
    );
  };

  // const selectedData = useSelector(
  //   (state) => state.selectedOptions.selectedData
  // );
  const value = useSelector((state) => state.selectedOptions.value);

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
    dropdownStyle: {
      overflow: "auto",
      zIndex: 10000,
    },
  };

  // employee by dept
  const valueByDeptMap = {};
  function loopsByDept(list, parent) {
    return (list || []).map(({ children, value }) => {
      const node = (valueByDeptMap[value] = {
        parent,
        value,
      });
      node.children = loopsByDept(children, node);
      return node;
    });
  }

  loopsByDept(treeData);
  function getByDeptPath(value) {
    const path = [];
    let current = valueByDeptMap[value];
    while (current) {
      path.unshift(current.value);
      current = current.parent;
    }
    return path;
  }

  // employees By dept
  const onSelectByDept = (value, node) => {
    const selectedNode = {
      departmentName: node.title,
      titles: [],
    };

    const path = getByDeptPath(value);
    if (path.length > 1) {
      // Selected a child node
      const parentValue = path[0];
      selectedNode.departmentName = parentValue;
      selectedNode.titles.push(path[1] || []);
    } else {
      // Selected a parent node
      const parentValue = path[0];
      selectedNode.departmentName = parentValue;
      selectedNode.titles = node.children.map((child) => child.value);
    }

    setEmployeeOptionsByDept((prevState) => ({
      ...prevState,
      ...selectedNode,
    }));
  };

  const onDeptCountOptions = (queryName, value) => {
    if (value === null || NaN) {
      // Handle the case when the value is cleared (null)
      setEmployeeOptionsByDept((prevState) => ({
        ...prevState,
        [queryName]: null,
      }));
    }
    setEmployeeOptionsByDept((prevState) => ({
      ...prevState,
      [queryName]: +value?.value,
    }));
  };

  const onChangeByDept = (newValue, selectedNodes) => {
    if (!newValue) {
      // Clear the selected value and count values
      setValueByDept("");
      setEmployeeOptionsByDept({});
    } else {
      setValueByDept(newValue);
    }
  };

  // set temp selected options
  const updateSelectedOptions = (queryName, value) => {
    setSelectedOptionsTemp((prevState) => ({
      ...prevState,
      [queryName]: value,
    }));
  };

  const handleContactReq = (selectedOption, triggeredAction) => {
    // setselectedContactreq(selectedOption);
    onContactreqChange(selectedOption);
    if (triggeredAction.action === "clear") {
      dispatch(clearAllSelectedOptions());
      dispatch(clearSelectedByDept());
    }
  };

  const handleApplyFilters = () => {
    if (!selectedOptionsTemp) return;

    if (selectedContactreq !== null) {
      const datesValues = selectedContactreq?.value;

      filterExportHistory(datesValues).then((data) => {
        // Access the filtered data here
        const { dateValuesFilters, selectedIds } = data;
        let exportedFilters = {
          ...dateValuesFilters[0],
        };

        dispatch(getSelectedIds(selectedIds));
        dispatch(setSelectedOptions({ exportedFilters }));

        Object.entries(exportedFilters).forEach(([name, value]) => {
          dispatch(setQueryData({ name, value }));
        });
      });
    }
    Object.entries(selectedOptionsTemp).forEach(([queryName, value]) => {
      dispatch(setSelectedOptions({ queryName, value }));
    });

    const updatedSelectedData = [];

    selectedNodes.forEach((selectedNode) => {
      const { value, node } = selectedNode;
      const path = getPath(value);
      const departmentName = path[0];
      const titles = [];

      if (path.length > 1) {
        // Selected a child node
        titles.push(path[1] || "");
      } else {
        // Selected a parent node
        titles.push(...node.children.map((child) => child.value));
      }

      updatedSelectedData.push({
        departmentName,
        titles,
      });
    });

    // jobfunction and dept
    dispatch(updateSelectedData(updatedSelectedData));
    //employees by dept
    dispatch(updateEmployeesByDeptData(employeeOptionsByDept));

    // Clear selectedNodes
    setSelectedNodes([]);

    Object.entries(selectedOptionsTemp).forEach(([name, value]) => {
      const arrayOfValues = (Array.isArray(value) ? value : [value]).map(
        (option) => option && option.value
      );
      dispatch(setQueryData({ name, value: arrayOfValues }));
    });
  };

  const predefinedRange = (value) => {
    if (value) {
      const [min, max] = value.value.split("-");
      updateSelectedOptions("minEmployeeCount", { value: min, label: min });
      updateSelectedOptions("maxEmployeeCount", { value: max, label: max });
    } else {
      // Clear the selected options for minEmployeeCount and maxEmployeeCount
      updateSelectedOptions("minEmployeeCount", null);
      updateSelectedOptions("maxEmployeeCount", null);
    }
  };

  const [selectedRange, setSelectedRange] = useState("predefined");

  const handleRadioChange = (event) => {
    setSelectedRange(event.target.value);
    updateSelectedOptions("minEmployeeCount", null);
    updateSelectedOptions("maxEmployeeCount", null);
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      width: "90%",
    }),
  };

  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (event) => {
    // setStartDate(event.target.value);
    updateSelectedOptions("fundingstartdate", event.target.value);
  };

  const handleEndDateChange = (event) => {
    // setEndDate(event.target.value);
    updateSelectedOptions("fundingenddate", event.target.value);
  };

  return (
    <>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-scrollable custom-modal-size">
          <div className="modal-content custom-modal-content">
            <div className="modal-header">
              <h5 className="ms-3" id="exampleModalLabel">
                Filters
              </h5>
              <div>
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={handleApplyFilters}
                  data-bs-dismiss="modal"
                >
                  Apply filters
                </button>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </div>

            <div className="modal-body pb-5">
              <div>
                <h6 className="p-2 ms-1">PERSON INFO</h6>
                <div className="container p-2 ms-1">
                  <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1  row-cols-lg-2 row-cols-xl-3">
                    <div className="col">
                      <ToggleFilter title="Name">
                        <CreatableSelect
                          isClearable
                          options={options}
                          formatCreateLabel={formatCreateLabel}
                          name="name"
                          value={selectedOptionsTemp?.name}
                          noOptionsMessage={() => null}
                          components={{ DropdownIndicator: null }}
                          placeholder="e.g. Bill, John"
                          onChange={(value) =>
                            updateSelectedOptions("name", value)
                          }
                        />
                      </ToggleFilter>
                    </div>
                    <div className="col">
                      <ToggleFilter title="Job Titles">
                        <p>Include List of Titles </p>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          name="title"
                          value={selectedOptionsTemp?.title}
                          loadOptions={(inputValue, callback) =>
                            loadOptionsDebounced("title", inputValue, callback)
                          }
                          onChange={(value) =>
                            updateSelectedOptions("title", value)
                          }
                          isSearchable
                        ></AsyncSelect>
                        <p>Exclude List of Titles </p>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          name="excTitle"
                          value={selectedOptionsTemp?.excTitle}
                          loadOptions={(inputValue, callback) =>
                            excludeOptionsDebounced(
                              "title",
                              inputValue,
                              callback
                            )
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
                          placeholder="Management"
                          options={managementLevels}
                          name="seniority"
                          value={selectedOptionsTemp?.seniority}
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
                      </ToggleFilter>
                    </div>
                    <div className="col">
                      <ToggleFilter title="Location">
                        <p>Include contact locations</p>
                        <AsyncSelect
                          isMulti
                          // isClearable
                          cacheOptions
                          defaultOptions
                          name="contactlocation"
                          value={selectedOptionsTemp?.contactlocation}
                          loadOptions={(inputValue, callback) =>
                            includeLocationDebounced(
                              "contactlocation",
                              ["city", "state", "country"],
                              inputValue,
                              callback
                            )
                          }
                          onChange={(value) =>
                            updateSelectedOptions("contactlocation", value)
                          }
                          isSearchable
                        ></AsyncSelect>
                        <p>Exclude contact locations</p>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          name="excludeContactLoc"
                          value={selectedOptionsTemp?.excludeContactLoc}
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
                      </ToggleFilter>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h6 className="p-2 ms-1">COMPANY INFO</h6>
                <div className="container  p-2 ms-1">
                  <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1  row-cols-lg-2 row-cols-xl-3 ">
                    <div className="col">
                      <ToggleFilter title="Company">
                        <p>Include list of companies</p>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          name="company"
                          value={selectedOptionsTemp?.company}
                          loadOptions={(inputValue, callback) =>
                            loadOptionsDebounced(
                              "company",
                              inputValue,
                              callback
                            )
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
                          value={selectedOptionsTemp?.excComp}
                          loadOptions={(inputValue, callback) =>
                            excludeOptionsDebounced(
                              "company",
                              inputValue,
                              callback
                            )
                          }
                          onChange={(value) =>
                            updateSelectedOptions("excComp", value)
                          }
                          isSearchable
                        ></AsyncSelect>
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="# Employees">
                        <div className="form-check ms-2">
                          <input
                            className="form-check-input"
                            type="radio"
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
                                value={selectedOptionsTemp?.minEmployeeCount}
                                noOptionsMessage={() => null}
                                components={{ DropdownIndicator: null }}
                                placeholder="Min"
                                onChange={(value) =>
                                  updateSelectedOptions(
                                    "minEmployeeCount",
                                    value
                                  )
                                }
                              />
                            </div>
                            <div className="col">
                              <CreatableSelect
                                isClearable
                                options={options}
                                formatCreateLabel={formatCreateLabel}
                                name="maxEmployeeCount"
                                value={selectedOptionsTemp?.maxEmployeeCount}
                                noOptionsMessage={() => null}
                                components={{ DropdownIndicator: null }}
                                placeholder="Max"
                                onChange={(value) =>
                                  updateSelectedOptions(
                                    "maxEmployeeCount",
                                    value
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Industry">
                        <p>Include List of Industries </p>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          name="industry"
                          value={selectedOptionsTemp?.industry}
                          loadOptions={(inputValue, callback) =>
                            loadOptionsDebounced(
                              "industry",
                              inputValue,
                              callback
                            )
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
                          value={selectedOptionsTemp?.excInd}
                          loadOptions={(inputValue, callback) =>
                            excludeOptionsDebounced(
                              "industry",
                              inputValue,
                              callback
                            )
                          }
                          onChange={(value) =>
                            updateSelectedOptions("excInd", value)
                          }
                          isSearchable
                        ></AsyncSelect>
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Company Location">
                        <p>Include company locations</p>
                        <AsyncSelect
                          isMulti
                          isClearable
                          cacheOptions
                          defaultOptions
                          name="companylocation"
                          value={selectedOptionsTemp?.companylocation}
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
                          value={selectedOptionsTemp?.excludeCompanyLoc}
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
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Keywords">
                        <p>Include List of Keywords </p>
                        <CreatableSelect
                          isMulti
                          options={options}
                          formatCreateLabel={formatCreateLabel}
                          name="keywords"
                          value={selectedOptionsTemp?.keywords}
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
                          value={selectedOptionsTemp?.exckeywords}
                          noOptionsMessage={() => null}
                          components={{ DropdownIndicator: null }}
                          placeholder="Exclude keywords"
                          onChange={(value) =>
                            updateSelectedOptions("exckeywords", value)
                          }
                        />
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="SIC Codes">
                        <p>Include List of SIC Codes </p>
                        <AsyncSelect
                          isMulti
                          cacheOptions
                          defaultOptions
                          name="siccodes"
                          value={selectedOptionsTemp?.siccodes}
                          loadOptions={(inputValue, callback) =>
                            loadOptionsDebounced(
                              "siccodes",
                              inputValue,
                              callback
                            )
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
                          value={selectedOptionsTemp?.excSiccodes}
                          loadOptions={(inputValue, callback) =>
                            excludeOptionsDebounced(
                              "siccodes",
                              inputValue,
                              callback
                            )
                          }
                          onChange={(value) =>
                            updateSelectedOptions("excSiccodes", value)
                          }
                          isSearchable
                        ></AsyncSelect>
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Technologies">
                        <p>Include List of Technologies </p>
                        <CreatableSelect
                          isMulti
                          options={options}
                          formatCreateLabel={formatCreateLabel}
                          name="technologies"
                          value={selectedOptionsTemp?.technologies}
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
                          value={selectedOptionsTemp?.excTech}
                          noOptionsMessage={() => null}
                          components={{ DropdownIndicator: null }}
                          placeholder="Exclude Technologies"
                          onChange={(value) =>
                            updateSelectedOptions("excTech", value)
                          }
                        />
                      </ToggleFilter>
                    </div>

                    <EmployeesByDept
                      onSelectByDept={onSelectByDept}
                      onDeptCountOptions={onDeptCountOptions}
                      onChangeByDept={onChangeByDept}
                      valueByDept={valueByDept}
                      employeeOptionsByDept={employeeOptionsByDept}
                    />

                    <div className="col">
                      <ToggleFilter title="Revenue">
                        <div className="row py-2">
                          <div className="col">
                            <Select
                              isClearable
                              options={revenueOptions}
                              name="minRevenue"
                              value={selectedOptionsTemp?.minRevenue}
                              placeholder="Min"
                              onChange={(value) =>
                                updateSelectedOptions("minRevenue", value)
                              }
                            />
                          </div>
                          <div className="col">
                            <Select
                              isClearable
                              options={revenueOptions}
                              name="maxRevenue"
                              value={selectedOptionsTemp?.maxRevenue}
                              placeholder="Max"
                              onChange={(value) =>
                                updateSelectedOptions("maxRevenue", value)
                              }
                            />
                          </div>
                        </div>
                      </ToggleFilter>
                    </div>
                    <div className="col">
                      <ToggleFilter title="Funding">
                        <div className="row">
                          <div className="col">
                            <Select
                              defaultValue={[]}
                              isMulti
                              closeMenuOnSelect={false}
                              hideSelectedOptions={false}
                              placeholder="Funding Type"
                              options={fundingTypeOptions}
                              name="latestfunding"
                              value={selectedOptionsTemp?.latestfunding}
                              onChange={(value) =>
                                updateSelectedOptions("latestfunding", value)
                              }
                              components={{
                                Option: InputOption,
                              }}
                            />
                          </div>
                        </div>
                        <div className="row pt-2">
                          <p>Total Funding Amount</p>
                          <div className="col">
                            <Select
                              isClearable
                              options={revenueOptions}
                              name="mintotalfunding"
                              value={selectedOptionsTemp?.mintotalfunding}
                              placeholder="Min"
                              onChange={(value) =>
                                updateSelectedOptions("mintotalfunding", value)
                              }
                            />
                          </div>
                          <div className="col">
                            <Select
                              isClearable
                              options={revenueOptions}
                              name="maxtotalfunding"
                              value={selectedOptionsTemp?.maxtotalfunding}
                              placeholder="Max"
                              onChange={(value) =>
                                updateSelectedOptions("maxtotalfunding", value)
                              }
                            />
                          </div>
                        </div>
                        {/* <div className="row pt-2">
                          <div className="col">
                            <p>Last Funding Round Date</p>
                            <div className="row">
                              <div className="col">
                                <label
                                  htmlFor="startDate"
                                  className="form-label"
                                >
                                  From:
                                </label>
                                <input
                                  type="date"
                                  id="startDate"
                                  name="fundingstartdate"
                                  className="form-control"
                                  // value={startDate}
                                  value={selectedOptionsTemp?.fundingstartdate}
                                  onChange={handleStartDateChange}
                                />
                              </div>
                              <div className="col">
                                <label htmlFor="endDate" className="form-label">
                                  To:
                                </label>
                                <input
                                  type="date"
                                  id="endDate"
                                  name="fundingenddate"
                                  className="form-control"
                                  value={selectedOptionsTemp?.fundingenddate}
                                  // value={endDate}
                                  onChange={handleEndDateChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div> */}

                        <div className="row pt-2">
                          <p>Last Funding Round Amount</p>
                          <div className="col">
                            <Select
                              isClearable
                              options={revenueOptions}
                              name="minlastfunding"
                              value={selectedOptionsTemp?.minlastfunding}
                              placeholder="Min"
                              onChange={(value) =>
                                updateSelectedOptions("minlastfunding", value)
                              }
                            />
                          </div>
                          <div className="col">
                            <Select
                              isClearable
                              options={revenueOptions}
                              name="maxlastfunding"
                              value={selectedOptionsTemp?.maxlastfunding}
                              placeholder="Max"
                              onChange={(value) =>
                                updateSelectedOptions("maxlastfunding", value)
                              }
                            />
                          </div>
                        </div>
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Founded Year">
                        <div className="row">
                          <div className="col">
                            <CreatableSelect
                              isClearable
                              options={options}
                              formatCreateLabel={formatCreateLabel}
                              name="minfoundedyear"
                              value={selectedOptionsTemp?.minfoundedyear}
                              noOptionsMessage={() => null}
                              components={{ DropdownIndicator: null }}
                              placeholder="Min Year"
                              onChange={(value) =>
                                updateSelectedOptions("minfoundedyear", value)
                              }
                            />
                          </div>
                          <div className="col">
                            <CreatableSelect
                              isClearable
                              options={options}
                              formatCreateLabel={formatCreateLabel}
                              name="maxfoundedyear"
                              value={selectedOptionsTemp?.maxfoundedyear}
                              noOptionsMessage={() => null}
                              components={{ DropdownIndicator: null }}
                              placeholder="Max Year"
                              onChange={(value) =>
                                updateSelectedOptions("maxfoundedyear", value)
                              }
                            />
                          </div>
                        </div>
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Retail Locations">
                        <div className="row">
                          <div className="col">
                            <CreatableSelect
                              isClearable
                              options={options}
                              formatCreateLabel={formatCreateLabel}
                              name="minRetailLoc"
                              value={selectedOptionsTemp?.minRetailLoc}
                              noOptionsMessage={() => null}
                              components={{ DropdownIndicator: null }}
                              placeholder="Min"
                              onChange={(value) =>
                                updateSelectedOptions("minRetailLoc", value)
                              }
                            />
                          </div>
                          <div className="col">
                            <CreatableSelect
                              isClearable
                              options={options}
                              formatCreateLabel={formatCreateLabel}
                              name="maxRetailLoc"
                              value={selectedOptionsTemp?.maxRetailLoc}
                              noOptionsMessage={() => null}
                              components={{ DropdownIndicator: null }}
                              placeholder="Max"
                              onChange={(value) =>
                                updateSelectedOptions("maxRetailLoc", value)
                              }
                            />
                          </div>
                        </div>
                      </ToggleFilter>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h6 className="p-2 ms-1">MISC.</h6>
                <div className="container  p-2 ms-1">
                  <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1  row-cols-lg-2 row-cols-xl-3">
                    <div className="col">
                      <ToggleFilter title="Email Status">
                        <div className="nk-menu-item ">
                          Buisness Email Status
                        </div>
                        <Select
                          defaultValue={[]}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          value={selectedOptionsTemp?.emailstatus}
                          options={emailStatusOptions}
                          name="emailstatus"
                          onChange={(value) =>
                            updateSelectedOptions("emailstatus", value)
                          }
                          components={{
                            Option: InputOption,
                          }}
                        />
                      </ToggleFilter>
                    </div>

                    <div className="col">
                      <ToggleFilter title="Phone Status">
                        <div className="nk-menu-item ">Phone Number Status</div>
                        <Select
                          defaultValue={[]}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          value={selectedOptionsTemp?.phonestatus}
                          options={phoneStatusOptions}
                          name="phonestatus"
                          onChange={(value) =>
                            updateSelectedOptions("phonestatus", value)
                          }
                          components={{
                            Option: InputOption,
                          }}
                        />
                      </ToggleFilter>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h6 className="p-2 ms-1">CREATED SOURCE</h6>
                <div className="container  p-2 ms-1">
                  <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1  row-cols-lg-2 row-cols-xl-3">
                    <div className="col">
                      <ToggleFilter title="Contact Data Request">
                        <AsyncSelect
                          // isMulti
                          cacheOptions
                          isClearable
                          defaultOptions
                          name="dataReq"
                          loadOptions={loadOptionsExport}
                          // value={selectedContactreq}
                          components={{ Option: ExportDataLoadOptions }}
                          onChange={handleContactReq}
                          isSearchable
                        ></AsyncSelect>
                      </ToggleFilter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-modal-content {
          background-color: #f5f6fa;
        }
        .content-heading {
          background-color: #f5f6fa;
        }
        .content-heading {
          margin-bottom: 5px;
          margin-top: 10px;
        }
        .modal-content {
          height: 650px;
          overflow-y: auto;
        }
        .custom-modal-size {
          max-width: 1150px;
          width: 90%;
        }
      `}</style>
    </>
  );
}

export default FilterModal;

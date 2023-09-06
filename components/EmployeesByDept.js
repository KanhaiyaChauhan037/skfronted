import ToggleFilter from "@/utils/ToggleFilter";
import { TreeSelect } from "antd";
import treeData from "./data";
import CreatableSelect from "react-select/creatable";
import { transformCountProperties } from "@/utils/transformValue";

const EmployeesByDept = (props) => {
  const options = [];
  const {
    onSelectByDept,
    onDeptCountOptions,
    onChangeByDept,
    valueByDept,
    employeeOptionsByDept,
  } = props;
  const formatMinLabel = (inputValue) => `Min value ${inputValue}`;
  const formatMaxLabel = (inputValue) => `Max Value ${inputValue}`;

  const transformedEmployeesByDept = transformCountProperties(
    employeeOptionsByDept
  );

  return (
    <div className="col">
      <ToggleFilter title="# Employees By Dept.">
        <div>
          <div className="pt-2">
            <TreeSelect
              style={{
                width: "100%",
              }}
              value={valueByDept}
              dropdownStyle={{
                maxHeight: 400,
                overflow: "auto",
                zIndex: 10000,
              }}
              treeData={treeData}
              allowClear
              showSearch
              filterTreeNode="true"
              treeNodeFilterProp="title"
              placeholder="Please select"
              treeDefaultExpandAll
              onChange={onChangeByDept}
              onSelect={onSelectByDept}
            />
          </div>
        </div>
        <div className="row pt-2">
          <p>Select range</p>
          <div className="col">
            <CreatableSelect
              isClearable
              options={options}
              formatCreateLabel={formatMinLabel}
              name="minCount"
              value={transformedEmployeesByDept?.minCount}
              onChange={(value) => onDeptCountOptions("minCount", value)}
              noOptionsMessage={() => null}
              components={{ DropdownIndicator: null }}
              placeholder="Min"
            />
          </div>
          <div className="col">
            <CreatableSelect
              isClearable
              options={options}
              formatCreateLabel={formatMaxLabel}
              name="maxCount"
              value={transformedEmployeesByDept?.maxCount}
              onChange={(value) => onDeptCountOptions("maxCount", value)}
              noOptionsMessage={() => null}
              components={{ DropdownIndicator: null }}
              placeholder="Max"
            />
          </div>
        </div>
      </ToggleFilter>
    </div>
  );
};

export default EmployeesByDept;

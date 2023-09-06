import { useState } from "react";

const isObject = (obj) => {
  return typeof obj === "object";
};

const areAllTrue = (obj) => {
  return Object.values(obj).every((value) => {
    if (isObject(value)) {
      return areAllTrue(value);
    }
    return value;
  });
};

const setAllBool = (obj, bool) => {
  let newObj = obj;

  Object.entries(obj).forEach(([key, value]) => {
    newObj[key] = isObject(value) ? setAllBool(value, bool) : bool;
  });

  return newObj;
};

const NestedCheckbox = ({ items, handleClick, isParent = true }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (key) => {
    const newExpandedItems = {
      ...expandedItems,
      [key]: !expandedItems[key],
    };

    setExpandedItems(newExpandedItems);
  };

  const handleCheckboxClick = (key, value, isGroup) => {
    const newValue = isObject(value)
      ? isGroup
        ? setAllBool(value, !areAllTrue(value))
        : value
      : !value;

    const newObj = {
      ...items,
      [key]: newValue,
    };

    handleClick(key, newObj, false);
  };

  return (
    <>
      {Object.entries(items).map(([key, value]) => {
        const checked = isObject(value) ? areAllTrue(value) : value;
        const isExpanded = expandedItems[key];

        return (
          <div className="form-check" key={key}>
            <div className="d-flex  justify-content-between">
              <div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={checked}
                  onClick={() =>
                    handleCheckboxClick(key, value, isObject(value))
                  }
                />
                <span className="label-text ">{key}</span>
              </div>
              {isParent && (
                <span
                  className="toggle-btn "
                  onClick={() => toggleExpanded(key)}
                >
                  {isExpanded ? (
                    <em
                      className="icon ni ni-minus-circle btn-primary"
                      style={{ color: "#9D72FF" }}
                    ></em>
                  ) : (
                    <em
                      className="icon ni ni-plus-circle btn-primary"
                      style={{ color: "#9D72FF" }}
                    ></em>
                  )}
                </span>
              )}
            </div>
            {isExpanded && (
              <div className="nested-checkboxes ">
                <NestedCheckbox
                  items={value}
                  handleClick={(x, value) =>
                    handleCheckboxClick(key, value, false)
                  }
                  isParent={false}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default NestedCheckbox;

export function transformValue(optionsArray) {
  if (Array.isArray(optionsArray) && optionsArray[0] !== undefined) {
    return optionsArray.map((value) => ({
      value,
      label: value,
    }));
  } else {
    return [];
  }
}
export function transformRevenueValue(optionsArray) {
  if (Array.isArray(optionsArray) && optionsArray[0] !== undefined) {
    return optionsArray.map((value) => {
      if (value < 1000) {
        return {
          value: value.toString() + "M",
          label: value.toString() + "M",
        };
      } else {
        return {
          value: (value / 1000).toString() + "B",
          label: (value / 1000).toString() + "B",
        };
      }
    });
  } else {
    return [];
  }
}

// employeesByDept Count transform
export function transformCountProperties(employeesByDept) {
  const { minCount, maxCount, ...rest } = employeesByDept;

  const transformedMinCount =
    typeof minCount === "number" && !isNaN(minCount)
      ? { value: minCount.toString(), label: minCount.toString() }
      : { value: "", label: "" };
  const transformedMaxCount =
    typeof maxCount === "number" && !isNaN(maxCount)
      ? { value: maxCount.toString(), label: maxCount.toString() }
      : { value: "", label: "" };

  return {
    ...rest,
    minCount: [transformedMinCount],
    maxCount: [transformedMaxCount],
  };
}

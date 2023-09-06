import treeData from "@/components/data";
import { createSlice } from "@reduxjs/toolkit";

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

const selectedByDeptSlice = createSlice({
  name: "selectedOptionsByDept",
  initialState: {},
  reducers: {
    onSelectByDept: (state, action) => {
      const { value, node } = action.payload;
      const selectedNode = {
        departmentName: node.title,
        titles: [],
      };
      const path = getPath(value);
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
      state.selectedOptionsByDept = {
        ...state.selectedOptionsByDept,
        ...selectedNode,
      };
    },
    setDeptOptions: (state, action) => {
      const { queryName, value } = action.payload;
      state.selectedOptionsByDept[queryName] = +value?.value;
    },
    clearSelectedByDept: () => ({}),
  },
});

export const { onSelectByDept, setDeptOptions, clearSelectedByDept } =
  selectedByDeptSlice.actions;

export default selectedByDeptSlice.reducer;

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

const selectedOptionsSlice = createSlice({
  name: "selectedOptions",
  initialState: {
    options: [],
    selectedData: [],
    selectedEmployeesByDept: [],
    value: [],
    selectedNodes: [],
    selectedIds: null,
    exportedFilters: null,
  },
  reducers: {
    setSelectedOptions: (state, action) => {
      let { queryName, value, exportedFilters } = action.payload;
      if (exportedFilters) {
        Object.keys(exportedFilters).forEach((queryName) => {
          const value = exportedFilters[queryName];
          state.options = {
            ...state.options,
            [queryName]: value,
          };
        });
      }
      if (Array.isArray(value)) {
        const getValue = Object.values(value).map((item) => item.value);
        state.options = {
          ...state.options,
          [queryName]: getValue,
        };
      }
      // else if (
      //   queryName === "fundingstartdate" ||
      //   queryName === "fundingenddate"
      // ) {
      //   state.options = {
      //     ...state.options,
      //     [queryName]: value,
      //   };
      // }
      else if (value !== undefined) {
        state.options = {
          ...state.options,
          [queryName]: [value?.value],
        };
      }
    },

    getSelectedIds: (state, action) => {
      const value = action.payload;
      state.selectedIds = value[0];
    },
    onSelect: (state, action) => {
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

      // Store unique titles
      const uniqueTitles = new Set(selectedNode.titles);
      selectedNode.titles = Array.from(uniqueTitles);

      const existingIndex = state.selectedData.findIndex(
        (item) => item.departmentName === selectedNode.departmentName
      );
      if (existingIndex !== -1) {
        const existingTitles = state.selectedData[existingIndex].titles;
        selectedNode.titles.forEach((title) => {
          if (!existingTitles.includes(title)) {
            existingTitles.push(title);
          }
        });
      } else {
        state.selectedData.push(selectedNode);
      }
    },
    onDeselect: (state, action) => {
      const { value, node } = action.payload;
      const deselectedNode = {
        departmentName: node.title,
        titles: [],
      };
      const path = getPath(value);
      if (path.length > 1) {
        // Deselected a child node
        const parentValue = path[0];
        deselectedNode.departmentName = parentValue;
        deselectedNode.titles.push(path[1] || []);
      } else {
        // Deselected a parent node
        const parentValue = path[0];
        deselectedNode.departmentName = parentValue;
        deselectedNode.titles = node.children.map((child) => child.value);
      }

      const existingIndex = state.selectedData.findIndex(
        (item) => item.departmentName === deselectedNode.departmentName
      );
      if (existingIndex !== -1) {
        // Remove the deselected node from the titles array
        state.selectedData[existingIndex].titles = state.selectedData[
          existingIndex
        ].titles.filter((title) => !deselectedNode.titles.includes(title));
        // Remove the department if no titles remain
        if (state.selectedData[existingIndex].titles.length === 0) {
          state.selectedData.splice(existingIndex, 1);
        }
      }
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    updateSelectedData: (state, action) => {
      state.selectedData = action.payload;
    },
    updateEmployeesByDeptData: (state, action) => {
      state.selectedEmployeesByDept = action.payload;
    },
    addSelectedNode: (state, action) => {
      const { value, node } = action.payload;
      state.selectedNodes.push({ value, node });
    },
    removeSelectedNode: (state, action) => {
      const valueToRemove = action.payload;
      state.selectedNodes = state.selectedNodes.filter(
        (selectedNode) => selectedNode.value !== valueToRemove
      );
    },
    setExportedFilters: (state, action) => {
      state.exportedFilters = action.payload;
    },
    clearAllSelectedOptions: (state) => {
      state.options = [];
      state.selectedData = [];
      state.value = [];
      state.selectedNodes = [];
      state.selectedIds = null;
      state.exportedFilters = null;
    },
    clearSelectedIds: (state) => {
      state.selectedIds = null;
    },
  },
});

export const {
  setSelectedOptions,
  onSelect,
  onDeselect,
  setValue,
  updateSelectedData,
  addSelectedNode,
  removeSelectedNode,
  getSelectedIds,
  setExportedFilters,
  updateEmployeesByDeptData,
  clearAllSelectedOptions,
  clearSelectedIds,
} = selectedOptionsSlice.actions;
export default selectedOptionsSlice.reducer;

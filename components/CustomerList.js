import { useEffect, useState } from "react";
import LeadsItem from "./LeadsItem";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { downloadResource } from "../utils/downloadCSV";
import Script from "next/script";
import { filterCustomers } from "@/store/filterCustomersSlice";
import SideBar from "./SideBar";
import Header from "./Header";
import FilterModal from "./FilterModal";
import { fetchExportHistory } from "@/store/exportHistorySlice ";
import { setQueryData } from "@/store/queryDataSlice";
import { clearSelectedIds } from "@/store/selectedOptionsSlice";

function CustomerList() {
  const {
    data: customers,
    totalPages,
    totalCustomers,
    status,
  } = useSelector((state) => state.filterData);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [limit, setLimit] = useState(20);
  const startEntry = (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalCustomers);
  const queryData = useSelector((state) => state.queryDataAll);
  const [showModal, setShowModal] = useState(false);
  const maxVisiblePages = 5;
  const [selectedItemsToExport, setSelectedItemsToExport] = useState([]);

  const selectedOptions = useSelector((state) => state.selectedOptions);

  const { selectedData, selectedEmployeesByDept } = useSelector(
    (state) => state.selectedOptions
  );

  const [selectedContactreq, setselectedContactreq] = useState(null);
  const handleContactReq = (selectedOption) => {
    setselectedContactreq(selectedOption);
  };

  //Pagination
  useEffect(() => {
    const generatePageNumbers = () => {
      const pageArray = [];
      for (let i = 1; i <= totalPages; i++) {
        pageArray.push(i);
      }
      setPageNumbers(pageArray);
    };

    generatePageNumbers();
  }, [totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
  };
  const getPageNumbersToShow = () => {
    if (pageNumbers.length <= maxVisiblePages) {
      return pageNumbers;
    }
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfVisiblePages;
    let endPage = currentPage + halfVisiblePages;

    if (startPage <= 0) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (endPage > pageNumbers.length) {
      endPage = pageNumbers.length;
      startPage = endPage - maxVisiblePages + 1;
    }

    return pageNumbers.slice(startPage - 1, endPage);
  };

  // Export Handlers
  const handleExportCSV = async () => {
    downloadResource(queryData, "csv", selectedItemsToExport);
    if (selectedItemsToExport.length) {
      setSelectedItemsToExport([]);
    }
  };
  const handleExportExcel = async () => {
    downloadResource(queryData, "xlsx", selectedItemsToExport);
    if (selectedItemsToExport.length) {
      setSelectedItemsToExport([]);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOptions]);

  // useEffect(() => {
  //   dispatch(filterCustomers({ page: currentPage, limit: limit }));
  // }, [dispatch, currentPage, limit]);

  const page = currentPage;
  useEffect(() => {
    // Extract selected option values for each query
    if (!selectedOptions && !selectedData && !selectedEmployeesByDept) return;

    const querySelectData = selectedOptions?.options;
    const selectedIds = selectedOptions?.selectedIds;

    // dept and job function
    const jobfunction = selectedData?.map((data) => ({
      departmentName: data.departmentName,
      titles: data.titles,
    }));

    // #Employees By department
    let employeesCountByDept;

    if (
      selectedEmployeesByDept?.departmentName &&
      (selectedEmployeesByDept?.minCount || selectedEmployeesByDept?.maxCount)
    ) {
      if (
        selectedEmployeesByDept?.departmentName !== undefined &&
        selectedEmployeesByDept?.titles !== undefined &&
        selectedEmployeesByDept?.minCount !== NaN &&
        selectedEmployeesByDept?.maxCount !== NaN
      ) {
        employeesCountByDept = [selectedEmployeesByDept]?.map((data) => ({
          departmentName: data?.departmentName || "",
          titles: data?.titles || "",
          minCount: !isNaN(data?.minCount) ? data?.minCount : 1,
          maxCount: !isNaN(data?.maxCount)
            ? data?.maxCount
            : Number.MAX_SAFE_INTEGER,
        }));
        dispatch(
          setQueryData({
            name: "employeesCountByDept",
            value: employeesCountByDept,
          })
        );
      }
    }

    let queryData;
    if (querySelectData?.employeesCountByDept) {
      queryData = {
        ...querySelectData,
        jobfunction,
        selectedIds,
        page,
        limit,
      };
    } else {
      queryData = {
        ...querySelectData,
        jobfunction,
        employeesCountByDept,
        selectedIds,
        page,
        limit,
      };
    }

    // Check if any query has selected options
    // if (queryData) {
    //   const shouldDispatch = Object.values(queryData).some(
    //     (options) => options?.length > 0
    //   );

    //   if (!shouldDispatch) return;
    // }

    dispatch(filterCustomers(queryData));
  }, [
    selectedOptions,
    selectedData,
    selectedEmployeesByDept,
    page,
    limit,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchExportHistory());
  }, [dispatch]);

  // select checkobox to export
  const handleSelectAll = () => {
    if (selectedItemsToExport.length === customers.length) {
      // If all checkboxes are already selected, clear the selection
      setSelectedItemsToExport([]);
    } else {
      // Otherwise, select all checkboxes
      setSelectedItemsToExport(customers.map((customer) => customer._id));
    }
  };
  const handleCheckboxChange = (itemId) => {
    if (selectedItemsToExport.includes(itemId)) {
      // If the checkbox is already selected, remove it from the selection
      setSelectedItemsToExport(
        selectedItemsToExport.filter((id) => id !== itemId)
      );
    } else {
      // Otherwise, add it to the selection
      setSelectedItemsToExport([...selectedItemsToExport, itemId]);
    }
  };

  return (
    <>
      <div>
        <style type="text/css">
          {`
          .nk-tb-item:not(:last-child) .nk-tb-col {
            border-bottom: 1px solid rgba(219, 223, 234, 0.9);
          }
          .nk-tb-col {
            border: 1px solid rgba(219, 223, 234, 0.9);
          }
          .sub-text {
            color: #000;
          }
          .bg-dark {
            background: #000125 !important;
          }
          .col-wh {
            color: #fff !important;
          }
          .not_Active {
            background: #000125 !important;
            color: #fff;
          }
          .Active_Class {
            background: #9d72ff !important;
            color: #fff;
          }
          .color-light {
            color: #fff !important;
          }
          .offcanvas-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 1040;
          }
                    
        `}
        </style>

        <div className="nk-app-root">
          {/* main @s */}
          <div className="nk-main ">
            <SideBar
              page={currentPage}
              limit={limit}
              setShowModal={setShowModal}
              // toggleSidebar={toggleSidebar}
              // sidebarOpen={sidebarOpen}
            />

            {/* wrap @s */}

            <div className="nk-wrap">
              <Header />
              <div className="nk-content">
                <div className="container-fluid">
                  <div className="nk-content-inner">
                    <div className="nk-content-body">
                      <div className="nk-block-head nk-block-head-sm">
                        <div className="nk-block-between">
                          <div className="nk-block-head-content">
                            <h3 className="nk-block-title page-title">
                              Customers List
                            </h3>
                          </div>
                          {/* .nk-block-head-content */}
                        </div>
                        {/* .nk-block-between */}
                      </div>
                      {/* .nk-block-head */}
                      <div className="nk-block">
                        <div className="card card-stretch">
                          <div className="card-inner-group">
                            <div className="card-inner position-relative card-tools-toggle">
                              <div className="toggle-wrap nk-block-tools-toggle">
                                <div>
                                  <ul className="nk-block-tools g-3 d-flex flex-wrap ">
                                    <li>
                                      <button
                                        className="btn btn-primary color-light btn-outline-light"
                                        onClick={handleExportCSV}
                                      >
                                        <em className="icon ni buttons-csv" />
                                        <span>Export CSV</span>
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="btn btn-primary color-light btn-outline-light"
                                        onClick={handleExportExcel}
                                      >
                                        <em className="icon ni ni-file-xls" />
                                        <span>Export Excel</span>
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="btn btn-primary color-light btn-outline-light"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => setShowModal(true)}
                                      >
                                        <em className="icon ni ni-file-xls" />
                                        <span>More Filters</span>
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              {/* .toggle-wrap */}
                              <br />
                              <div className="card-title-group">
                                <div className="card-tools">
                                  <div className="g">
                                    <div className="pagination-goto d-flex justify-content-center justify-content-md-start gx-3">
                                      <div className="d-none d-sm-block">
                                        Show
                                      </div>
                                      <div>
                                        <select
                                          className="form-select js-select2"
                                          data-search="on"
                                          data-dropdown="xs center"
                                          value={limit}
                                          onChange={handleLimitChange}
                                        >
                                          <option value="10">10</option>

                                          <option value="20">20</option>
                                          <option value="30">30</option>
                                          <option value="40">40</option>
                                        </select>
                                      </div>
                                      <div className="d-none d-sm-block">
                                        Entries
                                      </div>
                                    </div>
                                  </div>
                                  {/* .pagination-goto */}
                                </div>
                                {/* .card-tools */}
                                <div className="card-tools">
                                  <div className="g">
                                    {startEntry} - {endEntry} Of{" "}
                                    {totalCustomers} Entries
                                  </div>
                                </div>
                              </div>
                              {/* .card-title-group */}
                              <div
                                className="card-search search-wrap"
                                data-search="search"
                              >
                                <div className="card-body">
                                  <div className="search-content">
                                    <a
                                      href="#"
                                      className="search-back btn btn-icon toggle-search"
                                      data-target="search"
                                    >
                                      <em className="icon ni ni-arrow-left" />
                                    </a>
                                    <input
                                      type="text"
                                      className="form-control border-transparent form-focus-none"
                                      placeholder="Search by name"
                                    />
                                    <button className="search-submit btn btn-icon">
                                      <em className="icon ni ni-search" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {/* .card-search */}
                            </div>
                            {/* .card-inner */}
                            {status === "loading" && (
                              <div className="d-flex justify-content-center p-5 ms-5">
                                <div className="spinner-border" role="status">
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </div>
                            )}
                            {status !== "loading" && (
                              <div className="card-inner p-0">
                                <div className="nk-tb-list nk-tb-ulist">
                                  <div className="nk-tb-item nk-tb-head bg-dark">
                                    <div className="nk-tb-col nk-tb-col-check">
                                      <div className="custom-control custom-control-sm custom-checkbox notext">
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="cid"
                                          checked={
                                            selectedItemsToExport.length ===
                                            customers?.length
                                          }
                                          onChange={handleSelectAll}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="cid"
                                        />
                                      </div>
                                    </div>
                                    <div className="nk-tb-col">
                                      <span className="sub-text col-wh">
                                        First Name
                                      </span>
                                    </div>
                                    <div className="nk-tb-col ">
                                      <span className="sub-text col-wh">
                                        Last Name
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-sm">
                                      <span className="sub-text col-wh">
                                        Title
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-sm">
                                      <span className="sub-text col-wh">
                                        Company
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-md">
                                      <span className="sub-text col-wh">
                                        # Employees
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-lg">
                                      <span className="sub-text col-wh">
                                        E-mail
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-xl">
                                      <span className="sub-text col-wh">
                                        Industry
                                      </span>
                                    </div>
                                    {/* <div className="nk-tb-col tb-col-md">
                                    <span className="sub-text col-wh">
                                      Keywords
                                    </span>
                                  </div> */}
                                  </div>
                                  {/* .nk-tb-item */}

                                  {customers?.map((customer) => (
                                    <LeadsItem
                                      key={customer._id}
                                      selectedItemsToExport={
                                        selectedItemsToExport
                                      }
                                      handleCheckboxChange={
                                        handleCheckboxChange
                                      }
                                      customer={customer}
                                    />
                                  ))}
                                  {/* .nk-tb-item */}
                                </div>
                                {/* .nk-tb-list */}
                              </div>
                            )}

                            {/* .card-inner */}
                            {status !== "loading" && totalCustomers !== 0 && (
                              <div className="card-inner">
                                <div className="nk-block-between-md g-3">
                                  <div className="g">
                                    Page {currentPage} / {totalPages}
                                  </div>
                                  <div className="g">
                                    <ul className="pagination justify-content-center justify-content-md-start">
                                      <li
                                        className="page-item"
                                        onClick={() => {
                                          if (currentPage !== 1) {
                                            handlePageChange(currentPage - 1);
                                          }
                                        }}
                                      >
                                        <Link
                                          className="page-link not_Active"
                                          style={{
                                            pointerEvents:
                                              currentPage === 1
                                                ? "none"
                                                : "auto",
                                          }}
                                          href=""
                                        >
                                          Prev
                                        </Link>
                                      </li>
                                      {getPageNumbersToShow().map(
                                        (pageNumber) => (
                                          <li
                                            className="page-item"
                                            key={pageNumber}
                                          >
                                            <Link
                                              className={`page-link ${
                                                pageNumber === currentPage
                                                  ? "Active_Class"
                                                  : "not_Active"
                                              }`}
                                              href=""
                                              onClick={() =>
                                                handlePageChange(pageNumber)
                                              }
                                            >
                                              {pageNumber}
                                            </Link>
                                          </li>
                                        )
                                      )}
                                      <li className="page-item">
                                        <div
                                          className="page-link not_Active"
                                          href=""
                                        >
                                          <em className="icon ni ni-more-h-alt"></em>
                                        </div>
                                      </li>
                                      <li
                                        className="page-item"
                                        onClick={() => {
                                          if (currentPage !== totalPages) {
                                            handlePageChange(currentPage + 1);
                                          }
                                        }}
                                      >
                                        <Link
                                          className="page-link not_Active"
                                          href=""
                                          style={{
                                            pointerEvents:
                                              currentPage === totalPages
                                                ? "none"
                                                : "auto",
                                          }}
                                        >
                                          Next
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                {/* .nk-block-between */}
                              </div>
                            )}

                            {/* .card-inner */}
                          </div>
                          {/* .card-inner-group */}
                        </div>
                        {/* .card */}
                      </div>
                      {/* .nk-block */}
                    </div>
                  </div>

                  {selectedOptions?.options.length === 0 &&
                    selectedData.length === 0 &&
                    selectedEmployeesByDept.length === 0 &&
                    totalCustomers === 0 && (
                      <div className="container d-flex align-items-center justify-content-center mt-5">
                        <p
                          className="alert alert-info  text-center"
                          style={{ fontWeight: "bold" }}
                        >
                          No Records Found.
                        </p>
                      </div>
                    )}
                  {(selectedOptions?.options.length !== 0 ||
                    selectedData.length !== 0 ||
                    selectedEmployeesByDept.length !== 0) &&
                    totalCustomers === 0 && (
                      <div className="container d-flex align-items-center justify-content-center mt-5">
                        <p
                          className="alert alert-info  text-center"
                          style={{ fontWeight: "bold" }}
                        >
                          No Match Found.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <FilterModal
              showModal={showModal}
              onContactreqChange={handleContactReq}
              selectedContactreq={selectedContactreq}
              page={currentPage}
              limit={limit}
            />
          </div>
        </div>
      </div>
      <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

export default CustomerList;

import Employee from "@/components/Employee";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import withAuthorization from "@/utils/withAuthorization";
import { useDispatch, useSelector } from "react-redux";
import Script from "next/script";
import NoSSRWrapper from "../../../components/NoSsr";
import { fetchEmployees } from "@/store/employeesSlice";

function Employees() {
  const dispatch = useDispatch();
  const [employeeName, setEmployeeName] = useState("");
  const employeesAll = useSelector(
    (state) => state.employeesAllData?.data?.employees
  );
  const { totalPages, totalCount } = useSelector(
    (state) => state.employeesAllData
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [limit, setLimit] = useState(20);
  const startEntry = (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalCount);
  const maxVisiblePages = 5;

  // pagination
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
  const page = currentPage;
  useEffect(() => {
    dispatch(fetchEmployees({ page, limit }));
  }, [currentPage, limit]);

  const handleChange = (event) => {
    setEmployeeName(event.target.value);
  };

  useEffect(() => {
    let timeoutId;

    const fetchEmployeesWithDebounce = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        dispatch(fetchEmployees({ name: employeeName, page, limit }));
      }, 500);
    };

    fetchEmployeesWithDebounce();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, employeeName, currentPage, limit]);

  return (
    <>
      <NoSSRWrapper>
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
      `}
          </style>
          <div className="nk-app-root">
            <div className="nk-main ">
              {/* sidebar @s */}
              <SideBar />
              {/* wrap @s */}
              <div className="nk-wrap ">
                <Header />
                <div className="nk-content ">
                  <div className="container-fluid">
                    <div className="nk-content-inner">
                      <div className="nk-content-body">
                        <div className="nk-block-head nk-block-head-sm">
                          <div className="nk-block-between">
                            <div className="nk-block-head-content">
                              <h3 className="nk-block-title page-title">
                                EMPLOYEES
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
                                    <ul className="nk-block-tools g-3">
                                      <li>
                                        <Link
                                          href="/admin/employee-list/create"
                                          className="btn btn-primary color-light btn-outline-light "
                                        >
                                          <em className="icon ni buttons-csv" />
                                          <span>Add Employee</span>
                                        </Link>
                                      </li>
                                      <div className="col">
                                        <input
                                          type="text"
                                          className="form-control custom-input"
                                          placeholder="Search employee..."
                                          name="employeeSearch"
                                          value={employeeName}
                                          onChange={handleChange}
                                        />
                                      </div>
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
                                      {startEntry} - {endEntry} Of {totalCount}{" "}
                                      Entries
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
                              <div className="card-inner p-0">
                                <div className="nk-tb-list nk-tb-ulist">
                                  <div className="nk-tb-item nk-tb-head bg-dark">
                                    <div className="nk-tb-col nk-tb-col-check">
                                      <div className="custom-control custom-control-sm custom-checkbox notext">
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="cid"
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="cid"
                                        />
                                      </div>
                                    </div>
                                    <div className="nk-tb-col">
                                      <span className="sub-text col-wh">
                                        Name
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-sm">
                                      <span className="sub-text col-wh">
                                        Email
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-md">
                                      <span className="sub-text col-wh">
                                        Contact
                                      </span>
                                    </div>
                                    <div className="nk-tb-col tb-col-sm">
                                      <span className="sub-text col-wh">
                                        Status
                                      </span>
                                    </div>
                                    <div className="nk-tb-col">
                                      <span className="sub-text col-wh">
                                        Role
                                      </span>
                                    </div>
                                    <div className="nk-tb-col">
                                      <span className="sub-text col-wh">
                                        Edit
                                      </span>
                                    </div>
                                  </div>
                                  {/* .nk-tb-item */}
                                  {employeesAll?.map((employee) => (
                                    <Employee
                                      key={employee._id}
                                      employee={employee}
                                    />
                                  ))}
                                  {/* .nk-tb-item */}
                                </div>
                                {/* .nk-tb-list */}
                              </div>
                              {/* .card-inner */}
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
                                          href=""
                                          style={{
                                            pointerEvents:
                                              currentPage === 1
                                                ? "none"
                                                : "auto",
                                          }}
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
                                    {/* .pagination */}
                                  </div>
                                </div>
                                {/* .nk-block-between */}
                              </div>
                              {/* .card-inner */}
                            </div>
                            {/* .card-inner-group */}
                          </div>
                          {/* .card */}
                        </div>
                        {/* .nk-block */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
      </NoSSRWrapper>
      <style jsx>
        {`
          .custom-input {
            max-width: 200px;
          }
        `}
      </style>
    </>
  );
}

export default withAuthorization(Employees, "admin");

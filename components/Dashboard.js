import Head from "next/head";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import Script from "next/script";
import { useSelector } from "react-redux";
import NoSSRWrapper from "./NoSsr";
import EmployeesChart from "./EmployeesChart";

export default function Dashboard() {
  const { totalCustomers, totalIndustries, totalCompanies } = useSelector(
    (state) => state.filterData
  );

  const { totalCount, activeCount, suspendedCount } = useSelector(
    (state) => state.employeesAllData
  );

  return (
    <>
      <NoSSRWrapper>
        <Head>
          <base href="../" />
          <meta charSet="utf-8" />
          <meta name="author" content="Softnio" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta
            name="description"
            content="A powerful and conceptual apps base dashboard template that especially build for developers and programmers."
          />
          {/* Fav Icon  */}
          <link rel="shortcut icon" href="./images/favicon.png" />
          {/* Page Title  */}
          <title>Dashboard</title>
          {/* StyleSheets  */}
          {/* <link rel="stylesheet" href="./assets/css/dashlite.css?ver=3.1.2" /> */}
          {/* <link
    id="skin-default"
    rel="stylesheet"
    href="./assets/css/theme.css?ver=3.1.2"
  /> */}
        </Head>
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
          <div className="nk-body bg-lighter npc-default has-sidebar ">
            <div className="nk-app-root">
              {/* main @s */}
              <div className="nk-main ">
                {/* sidebar @s */}
                <SideBar />
                {/* wrap @s */}
                <div className="nk-wrap ">
                  {/* main header @s */}
                  <Header />
                  {/* content @s */}
                  <div className="nk-content ">
                    <div className="container-fluid">
                      <div className="nk-content-inner">
                        <div className="nk-content-body">
                          <div className="nk-block-head nk-block-head-sm">
                            <div className="nk-block-between">
                              <div className="nk-block-head-content">
                                <h3 className="nk-block-title page-title">
                                  Dashboard
                                </h3>
                              </div>
                              {/* .nk-block-head-content */}
                            </div>
                            {/* .nk-block-between */}
                          </div>
                          {/* .nk-block-head */}
                          <div className="nk-block">
                            <div className="row g-gs">
                              <div className="col-xxl-3 col-sm-6">
                                <div className="card">
                                  <div className="nk-ecwg nk-ecwg6">
                                    <div className="card-inner">
                                      <div className="card-title-group">
                                        <div className="card-title">
                                          <h6 className="title">
                                            Total Employees
                                          </h6>
                                        </div>
                                      </div>
                                      <div className="data">
                                        <div className="data-group">
                                          <div className="amount">
                                            {totalCount || 0}
                                          </div>
                                          <div className="nk-ecwg6-ck">
                                            <canvas
                                              className="ecommerce-line-chart-s3"
                                              id="todayOrders"
                                            />
                                          </div>
                                        </div>
                                        {/* <div className="info">
                                          <span className="change up text-danger">
                                            <em className="icon ni ni-arrow-long-up" />
                                            4.63%
                                          </span>
                                          <span>vs. last week</span>
                                        </div> */}
                                      </div>
                                    </div>
                                    {/* .card-inner */}
                                  </div>
                                  {/* .nk-ecwg */}
                                </div>
                                {/* .card */}
                              </div>
                              {/* .col */}
                              <div className="col-xxl-3 col-sm-6">
                                <div className="card">
                                  <div className="nk-ecwg nk-ecwg6">
                                    <div className="card-inner">
                                      <div className="card-title-group">
                                        <div className="card-title">
                                          <h6 className="title">
                                            Total Records
                                          </h6>
                                        </div>
                                      </div>
                                      <div className="data">
                                        <div className="data-group">
                                          <div className="amount">
                                            {totalCustomers}
                                          </div>
                                          <div className="nk-ecwg6-ck">
                                            <canvas
                                              className="ecommerce-line-chart-s3"
                                              id="todayRevenue"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* .card-inner */}
                                  </div>
                                  {/* .nk-ecwg */}
                                </div>
                                {/* .card */}
                              </div>
                              {/* .col */}
                              <div className="col-xxl-3 col-sm-6">
                                <div className="card">
                                  <div className="nk-ecwg nk-ecwg6">
                                    <div className="card-inner">
                                      <div className="card-title-group">
                                        <div className="card-title">
                                          <h6 className="title">
                                            Total Companies
                                          </h6>
                                        </div>
                                      </div>
                                      <div className="data">
                                        <div className="data-group">
                                          <div className="amount">
                                            {totalCompanies}
                                          </div>
                                          <div className="nk-ecwg6-ck">
                                            <canvas
                                              className="ecommerce-line-chart-s3"
                                              id="todayCustomers"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* .card-inner */}
                                  </div>
                                  {/* .nk-ecwg */}
                                </div>
                                {/* .card */}
                              </div>
                              {/* .col */}
                              <div className="col-xxl-3 col-sm-6">
                                <div className="card">
                                  <div className="nk-ecwg nk-ecwg6">
                                    <div className="card-inner">
                                      <div className="card-title-group">
                                        <div className="card-title">
                                          <h6 className="title">
                                            Total Indutries
                                          </h6>
                                        </div>
                                      </div>
                                      <div className="data">
                                        <div className="data-group">
                                          <div className="amount">
                                            {totalIndustries}
                                          </div>
                                          <div className="nk-ecwg6-ck">
                                            <canvas
                                              className="ecommerce-line-chart-s3"
                                              id="todayVisitors"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* .card-inner */}
                                  </div>
                                  {/* .nk-ecwg */}
                                </div>
                                {/* .card */}
                              </div>
                              {/* .col */}
                            </div>
                            {/* .row */}
                          </div>
                          {/* .nk-block */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="container d-flex justify-content-center align-items-center pb-4">
                    <EmployeesChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
        </div>
      </NoSSRWrapper>
    </>
  );
}

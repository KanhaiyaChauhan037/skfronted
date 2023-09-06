import Header from "@/components/Header";
import ImportExcel from "@/components/ImportExcel";
import SideBar from "@/components/SideBar";
import withAuthorization from "@/utils/withAuthorization";
import Script from "next/script";
import NoSSRWrapper from "../../components/NoSsr";

function excel() {
  return (
    <>
      <NoSSRWrapper>
        <div className="nk-app-root">
          <div className="nk-main ">
            {/* sidebar @s */}
            <SideBar />
            {/* wrap @s */}
            <div className="nk-wrap ">
              <Header />
              <ImportExcel />
            </div>
          </div>
        </div>
        <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
      </NoSSRWrapper>
    </>
  );
}

export default withAuthorization(excel, "admin");

import CustomerList from "@/components/CustomerList";
import NoSSRWrapper from "../components/NoSsr";
import withAuthorization from "@/utils/withAuthorization";

function records() {
  return (
    <>
      <NoSSRWrapper>
        <CustomerList />
      </NoSSRWrapper>
    </>
  );
}

export default withAuthorization(records, ["admin", "employee"]);

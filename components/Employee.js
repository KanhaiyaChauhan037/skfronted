import { useRouter } from "next/router";

function Employee(props) {
  const router = useRouter();
  const { name, email, contact, status, role, _id } = props?.employee || {};
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <>
      <div className="nk-tb-item">
        <div className="nk-tb-col nk-tb-col-check">
          <div className="custom-control custom-control-sm custom-checkbox notext">
            <input type="checkbox" className="custom-control-input" id="cid1" />
            <label className="custom-control-label" htmlFor="cid1" />
          </div>
        </div>
        <div className="nk-tb-col">
          <a href="html/customer-details.html">
            <div className="user-card">
              <div className="user-avatar xs bg-primary">
                <span>{initials}</span>
              </div>
              <div className="user-name">
                <span className="tb-lead">
                  {name} <span className="dot dot-success d-lg-none ms-1" />
                </span>
              </div>
            </div>
          </a>
        </div>
        <div className="nk-tb-col tb-col-sm">
          <span
            className="sub-text"
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </span>
        </div>
        <div className="nk-tb-col tb-col-md">
          <span className="sub-text">{contact}</span>
        </div>
        <div className="nk-tb-col tb-col-sm">
          <div className="icon-text">
            <span className="sub-text">{status}</span>
          </div>
        </div>
        <div className="nk-tb-col">
          <div className="icon-text">
            <span className="sub-text">{role}</span>
          </div>
        </div>
        <div className="nk-tb-col " style={{ maxWidth: "50px" }}>
          <button
            className="btn"
            onClick={() => router.push(`/admin/employee-list/edit/${_id}`)}
          >
            <em className="icon ni ni-edit-alt-fill"></em>
          </button>
        </div>
      </div>
    </>
  );
}

export default Employee;

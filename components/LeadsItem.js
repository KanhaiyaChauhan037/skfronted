function LeadsItem(props) {
  const {
    firstname,
    lastname,
    title,
    company,
    // departments,
    email,
    industry,
    // keywords,
    employeesCount,
    _id,
  } = props?.customer || {};

  const { selectedItemsToExport, handleCheckboxChange } = props || {};

  const initials = `${firstname?.charAt(0)}${lastname?.charAt(0) || ""}`;

  return (
    <>
      <div className="nk-tb-item">
        <div className="nk-tb-col nk-tb-col-check">
          <div className="custom-control custom-control-sm custom-checkbox notext">
            <input
              type="checkbox"
              className="custom-control-input"
              id={_id}
              checked={selectedItemsToExport.includes(_id)}
              onChange={() => handleCheckboxChange(_id)}
            />

            <label className="custom-control-label" htmlFor={_id} />
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
                  {firstname}{" "}
                  <span className="dot dot-success d-lg-none ms-1" />
                </span>
              </div>
            </div>
          </a>
        </div>
        <div className="nk-tb-col">
          <span
            className="sub-text"
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lastname}
          </span>
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
            {title}{" "}
          </span>
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
            {company}
          </span>
        </div>
        <div className="nk-tb-col tb-col-md">
          <span className="sub-text">{employeesCount} </span>
        </div>
        <div className="nk-tb-col tb-col-lg">
          <span
            className="sub-text"
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}{" "}
          </span>
        </div>
        <div className="nk-tb-col tb-col-xl">
          <span
            className="sub-text"
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {industry}{" "}
          </span>
        </div>
        {/* <div className="nk-tb-col tb-col-md">
          <span
            className="sub-text"
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {keywords}{" "}
          </span>
        </div> */}
      </div>
    </>
  );
}

export default LeadsItem;

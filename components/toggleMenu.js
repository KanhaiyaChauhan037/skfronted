import Link from "next/link";
import { useState } from "react";

const ToggleMenu = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className="nk-menu-item has-sub">
      <Link
        href=""
        className="nk-menu-link nk-menu-toggle"
        onClick={toggleMenu}
      >
        <span className="nk-menu-icon">
          <em className={icon} />
        </span>
        <span className="nk-menu-text">{title}</span>
      </Link>
      {isOpen && <div className="mt-3">{children}</div>}
    </li>
  );
};

export default ToggleMenu;

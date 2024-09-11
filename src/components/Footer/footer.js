import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <span>&#169;Copyright </span> 
         DTS.  All Rights Reserved
      </div>
      <div>
        Designed by &nbsp;
        <a href="https://www.dockyardsolutions.lk/" className="footerlink">
          Dockyard Total Solutions
        </a>
      </div>
    </footer>
  );
};

export default Footer;

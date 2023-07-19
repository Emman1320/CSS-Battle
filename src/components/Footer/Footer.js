import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div id="footer" className="footer-container">
      <table className="footer">
        <tr className="footer-item">
          <th>Name: </th>
          <td>Lorem</td>
        </tr>
        <tr className="footer-item">
          <th>Mobile Number:</th>
          <td>Lorem</td>
        </tr>
        <tr className="footer-item">
          <th>Address: </th>
          <td>
            1/19A, Thendral Street, <br />
            OMR Egattur,
            <br /> Chennai - 600130
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Footer;

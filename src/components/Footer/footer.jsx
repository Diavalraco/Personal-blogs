// Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by Aarush
        </p>
        <p>All rights reserved</p>
      </div>
      <style jsx>{`
        @media (max-width: 600px) {
          footer p {
            font-size: 12px; /* Smaller text on small devices */
          }
        }
      `}</style>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#282c34",
  color: "#ffffff",
  textAlign: "center",
  padding: "20px 0",
  position: "relative",
  bottom: 0,
  width: "100%",
  marginTop: "20px",
};

const footerContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
};

export default Footer;

import React from "react";
import { Link } from "react-router-dom";

function FooterLinks({ isSignUp }) {
  return (
    <div className="footer-links">
      {isSignUp ? (
        <Link to="/signIn">Already have an account? Sign In</Link>
      ) : (
        <>
          <Link to="/forgot-password">Forgot your password?</Link>
        </>
      )}
    </div>
  );
}

export default FooterLinks;

import "./Logo.css";
import logo from "../../assets/logo.jpeg";

export default function Logo({ size = 40, className = "" }) {
  return (
    <div className={`logo-container ${className}`}>
      <img
        src={logo}
        alt="SoloSync Logo"
        width={size}
        height={size}
        className="logo-image"
      />
    </div>
  );
}
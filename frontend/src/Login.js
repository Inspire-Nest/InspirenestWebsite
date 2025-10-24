import React, { useState, useEffect } from "react";
import { verifyOtpApi, sendOtpRequestApi } from "./api/endpoint";
import Swal from "sweetalert2";
import logo from "./assets/InspireNest_logo.jpeg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    src: "https://res.cloudinary.com/dnjnnhnps/image/upload/v1751003868/frame_1_1_1_mjp4qp.png",
    caption:
      "Celebrate and Encourage every <strong>Achievement</strong> and <strong>Milestone</strong>",
  },
  {
    src: "https://res.cloudinary.com/dnjnnhnps/image/upload/v1751003786/Frame_2_1_1_1_m4udp5.png",
    caption:
      "Make <strong>your work easier</strong> and enhance your <strong>employee relationship</strong>",
  },
  {
    src: "https://res.cloudinary.com/dnjnnhnps/image/upload/v1751003678/Frame_3_1_1_1_pb8qqs.png",
    caption:
      "Celebrate them on their special <strong>days &amp; occasions</strong>",
  },
];

export default function Login() {
  const [idx, setIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await sendOtpRequestApi(email);
      setOtpSent(true);
      Swal.fire({
        icon: "success",
        title: "OTP sent to your email.",
        text: "Please check your mail!",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const res = await verifyOtpApi(email, otp);
  //     localStorage.setItem("token", res.token);
  //     // ✅ Store full user object including companyId
  //     localStorage.setItem("user", JSON.stringify(res.user));
  //     const role = res.user.role;

  //     Swal.fire({
  //       icon: "success",
  //       title: "Login Successful!",
  //       text: "Welcome back!",
  //       confirmButtonColor: "#3085d6",
  //     });

  //     // ✅ Redirect based on role
  //     if (role === "Operation Manager") {
  //       navigate("/admin/dashboard");
  //     } else if (role === "HR") {
  //       navigate("/hr/empDashboard");
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Access Denied",
  //         text: "Unknown role",
  //       });
  //     }
  //   } catch (err) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Login Failed",
  //       text: "Invalid credentials",
  //     });
  //   }
  // };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await verifyOtpApi(email, otp);
      localStorage.setItem("token", res.token);

      // Save user object
      localStorage.setItem("user", JSON.stringify(res.user));

      // ✅ Extract and store companyId properly
      // ✅ Always extract only the ID, never the full object
      let companyId = null;

      if (res.user.companyId) {
        companyId = res.user.companyId; // already an ID
      } else if (res.user.company && res.user.company._id) {
        companyId = res.user.company._id; // extract _id from company object
      }

      if (companyId) {
        localStorage.setItem("companyId", companyId); // store ONLY the ID
        console.log("✅ Stored Company ID:", companyId);
      } else {
        console.warn("⚠️ companyId missing from login response!");
      }

      const role = res.user.role;

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back!",
        confirmButtonColor: "#3085d6",
      });

      if (role === "Operation Manager") {
        navigate("/admin/dashboard");
      } else if (role === "HR") {
        navigate("/hr/empDashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Unknown role",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid credentials",
      });
    }
  };

  return (
    <main className="loginpage-card">
      {/* LEFT SECTION */}
      <section className="login">
        <img
          className="logo"
          src={logo}
          alt="Logo"
          style={{ width: "50%", marginBottom: "10px" }}
        />
        <h1 style={{ color: "black" }}>Login</h1>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={otpSent}
          />

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <button type="submit">{otpSent ? "Verify OTP" : "Send OTP"}</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p className="privacy-note">This site is protected by privacy policy</p>
        <div className="footer-links">
          <a href="#">Terms and Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">CA Privacy Notice</a>
        </div>
      </section>

      {/* RIGHT SECTION */}
      <section className="carousel">
        <div className="img-wrap">
          <img src={slides[idx].src} alt="Slide" />
          <div className="overlay">
            <div className="dots">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === idx ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
            <p
              className="caption"
              dangerouslySetInnerHTML={{ __html: slides[idx].caption }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

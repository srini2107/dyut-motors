// "use client";
// import React, { useEffect, forwardRef, useState } from "react";
// import styles from "./LoginForm.module.css";

// const LoginForm = forwardRef(function LoginForm({ onLoginSuccess, onClose = () => { } }, ref) {
//   const [loginType, setLoginType] = useState("mobile"); // "mobile" or "email"
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState("input"); // "input" or "otp"
//   const [isLoading, setIsLoading] = useState(false);

//   const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
//   const validateEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSendOtp = async () => {
//     if (loginType === "mobile") {
//       if (!validateMobile(mobile)) {
//         alert("Please enter a valid 10-digit mobile number.");
//         return;
//       }
//     } else {
//       if (!validateEmail(email)) {
//         alert("Please enter a valid email address.");
//         return;
//       }
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch("/api/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           loginType === "mobile"
//             ? { mobile }
//             : { email }
//         ),
//       });
//       if (res.ok) {
//         alert("OTP sent successfully!");
//         setStep("otp");
//       } else {
//         const errorData = await res.json();
//         alert(errorData.error || "Failed to send OTP.");
//       }
//     } catch (error) {
//       alert("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp.trim()) {
//       alert("Please enter the OTP.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch("/api/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           loginType === "mobile"
//             ? { mobile, otp }
//             : { email, otp }
//         ),
//       });
//       if (res.ok) {
//         alert("OTP verified successfully!");
//         localStorage.setItem("isLoggedIn", "true");
//         onLoginSuccess();
//       } else {
//         const errorData = await res.json();
//         alert(errorData.error || "Failed to verify OTP.");
//       }
//     } catch (error) {
//       alert("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (ref && ref.current && !ref.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose, ref]);

//   return (
//     <div className={styles.loginFormOverlay}>
//       <div
//         className={styles.loginFormContainer}
//         ref={ref}
//         onMouseDown={e => e.stopPropagation()}
//       >
//         <img
//           src="/img1.png"
//           alt="Logo"
//           className={styles.loginLogo}
//         />
//         {step === "input" && (
//           <>
//             <h5>Login or Sign Up</h5>
//             <div className={styles.toggleWrapper}>
//               <button
//                 className={loginType === "mobile" ? styles.activeToggle : ""}
//                 onClick={() => setLoginType("mobile")}
//                 type="button"
//               >
//                 Mobile
//               </button>
//               <div className={styles.orDivider}>
//                 <span className={styles.orText}>or</span>
//               </div>
//               <button
//                 className={loginType === "email" ? styles.activeToggle : ""}
//                 onClick={() => setLoginType("email")}
//                 type="button"
//               >
//                 Email
//               </button>
//             </div>
//             {loginType === "mobile" ? (
//               <div className={styles.mobileInputWrapper}>
//                 <span className={styles.stdCode}>+91</span>
//                 <input
//                   type="text"
//                   placeholder="Enter Mobile Number"
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
//                   maxLength={10}
//                   className={styles.mobileInput}
//                 />
//               </div>
//             ) : (
//               <div className={styles.emailInputWrapper}>
//                 <input
//                   type="email"
//                   placeholder="Enter Email Address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className={styles.emailInput}
//                 />
//               </div>
//             )}
//             <button onClick={handleSendOtp} disabled={isLoading}>
//               {isLoading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </>
//         )}
//         {step === "otp" && (
//           <>
//             <h5>Enter OTP</h5>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
//               maxLength={6}
//               className={styles.otpInput}
//             />
//             <button onClick={handleVerifyOtp} disabled={isLoading}>
//               {isLoading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// });

// export default LoginForm;
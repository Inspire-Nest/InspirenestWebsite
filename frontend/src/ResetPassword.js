// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {resetPasswordApi} from "./api/endpoint"
// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const res = await fetch(`http://localhost:5000/api/auth/resetpassword/${token}`, {  // adjust URL to your backend reset endpoint
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ password }),
// //       });

// //       const data = await res.json();

// //       if (res.ok) {
// //         setMessage(data.message || 'Password reset successful!');
// //         setTimeout(() => {
// //           navigate('/');  // Redirect to login page after success
// //         }, 2000);
// //       } else {
// //         setError(data.message || 'Failed to reset password.');
// //       }
// //     } catch (err) {
// //       setError('Server error. Please try again later.');
// //     }
// //   };
// const handleSubmit = async () => {
//   try {
//     const result = await resetPasswordApi(token, password);
//     alert(result.message);  // show success message
//     // redirect to login or elsewhere
//   } catch (error) {
//     alert(error.message);  // show error message
//   }
// };
//   return (
//     <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
//       <h2>Reset Password</h2>
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
//         />
//         <button type="submit" style={{ width: '100%', padding: '10px' }}>
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

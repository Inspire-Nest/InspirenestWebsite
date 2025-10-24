const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "1d" }
  );
};

// Send OTP to email

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #2ecc71;">Your One-Time Password (OTP)</h2>
      <p>Hello,</p>
      <p>Use the following OTP to proceed with your login or verification:</p>
      <div style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px; display: inline-block; margin: 10px 0;">
        ${otp}
      </div>
      <p style="color: #888;">This code is valid for the next <strong>5 minutes</strong>. Please do not share this OTP with anyone.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 Your OTP Code for Verification",
    html: htmlBody,
  });
};

// ✅ Registration
exports.registerUser = async (req, res) => {
  const { name, username, email, password, role, mobilenumber } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or username already exists" });

    const user = await User.create({
      name,
      username,
      email,
      password,
      role,
      mobilenumber,
    });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        mobilenumber: user.mobilenumber,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// ✅ OTP Login Step 1: Send OTP
exports.otpLoginRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min valid
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "OTP request failed", error: err.message });
  }
};

// ✅ OTP Login Step 2: Verify OTP and Login
// exports.otpVerify = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (user.otp !== otp || user.otpExpires < new Date()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.json({
//       message: "Login via OTP successful",
//       token: generateToken(user),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         mobilenumber: user.mobilenumber,
//       },
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "OTP verification failed", error: err.message });
//   }
// };

exports.otpVerify = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email }); // ✅ Do NOT populate full company data
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      message: "Login via OTP successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobilenumber: user.mobilenumber,
        companyId: user.companyId ? user.companyId.toString() : null,
        // companyId: user.companyId.toString() // ✅ Ensure it's just ID
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

// ✅ Get all users
exports.getUserProfile = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

// ✅ Update user
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, username, password, role, mobilenumber } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.role = role || user.role;
    user.mobilenumber = mobilenumber || user.mobilenumber;
    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        mobilenumber: user.mobilenumber,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

const crypto = require("crypto");

// Add these fields in your User model (schema) for reset:
// resetPasswordToken: String,
// resetPasswordExpire: Date,

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set expiration on user document
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    // Send email with reset link (replace URL with your frontend URL)
    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    // Setup your email transport config (example with Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password reset request",
      text: `You requested a password reset. Please click on the link to reset your password: \n\n ${resetUrl} \n\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(message);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  console.log("Received token:", token);
  console.log("Hashed token:", resetPasswordToken);

  try {
    const user = await User.findOne({ resetPasswordToken });
    console.log("Found user:", user);

    if (!user || user.resetPasswordExpire < Date.now()) {
      console.log("Token expired or user not found.");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
};

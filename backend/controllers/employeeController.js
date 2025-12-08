const Employee = require("../models/Employee");
const mongoose = require("mongoose");

// exports.createEmployee = async (req, res) => {
//   try {
//     const {
//       companyId,
//       firstName,
//       lastName,
//       employeeCode,
//       employeeLevel,
//       managerName,
//       managerEmail,
//       email,
//       phoneNumber,
//       whatsappNumber,
//       gender,
//       maritalStatus,
//       dateOfBirth,
//       dateOfJoining,
//       anniversaryDate,
//       primaryAddress,
//       secondaryAddress,
//       pincode,
//       city,
//       state,
//       country,
//       spouseFirstName,
//       spouseLastName,
//       spouseDob,
//       spouseEmail,
//       spousePhone,
//       child1Name,
//       child1Gender,
//       child1Dob,
//       child2Name,
//       child2Gender,
//       child2Dob,
//     } = req.body;

//     // 🔍 Extract just the ObjectId string from nested object if needed
//     if (typeof companyId === "object" && companyId._id) {
//       companyId = companyId._id;
//     }

//     // ✅ Validate companyId
//     if (
//       !companyId ||
//       typeof companyId !== "string" ||
//       !mongoose.Types.ObjectId.isValid(companyId)
//     ) {
//       return res.status(400).json({ message: "Invalid company ID." });
//     }

//     // ✅ Create new employee
//     const newEmployee = new Employee({
//       company: companyId, // must be stringified ObjectId
//       firstName,
//       lastName,
//       employeeCode,
//       employeeLevel,
//       managerName,
//       managerEmail,
//       email,
//       phoneNumber,
//       whatsappNumber,
//       gender,
//       maritalStatus,
//       dateOfBirth,
//       dateOfJoining,
//       anniversaryDate,
//       primaryAddress,
//       secondaryAddress,
//       pincode,
//       city,
//       state,
//       country,
//       child1Name,
//       child1Gender,
//       child1Dob,
//       child2Name,
//       child2Gender,
//       child2Dob,
//     });

//     // ✅ Add spouse info only if married
//     if (maritalStatus?.toLowerCase() === "married") {
//       newEmployee.spouseFirstName = spouseFirstName;
//       newEmployee.spouseLastName = spouseLastName;
//       newEmployee.spouseDob = spouseDob;
//       newEmployee.spouseEmail = spouseEmail;
//       newEmployee.spousePhone = spousePhone;
//     }

//     await newEmployee.save();

//     res.status(201).json({
//       message: "Employee created successfully",
//       employee: newEmployee,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Employee creation failed",
//       error: err.message,
//     });
//   }
// };

// Get all employees for a specific company

// exports.createEmployee = async (req, res) => {
//   try {
//     let {
//       companyId,
//       firstName,
//       lastName,
//       employeeLevel,
//       managerName,
//       managerEmail,
//       email,
//       phoneNumber,
//       whatsappNumber,
//       gender,
//       maritalStatus,
//       dateOfBirth,
//       dateOfJoining,
//       anniversaryDate,
//       primaryAddress,
//       secondaryAddress,
//       pincode,
//       city,
//       state,
//       country,
//       spouseFirstName,
//       spouseLastName,
//       spouseDob,
//       spouseEmail,
//       spousePhone,
//       child1Name,
//       child1Gender,
//       child1Dob,
//       child2Name,
//       child2Gender,
//       child2Dob,
//     } = req.body;

//     if (typeof companyId === "object" && companyId._id) {
//       companyId = companyId._id;
//     }

//     if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
//       return res.status(400).json({ message: "Invalid company ID." });
//     }

//     // ✅ Auto-generate Employee Code
//     const lastEmployee = await Employee.findOne()
//       .sort({ createdAt: -1 })
//       .select("employeeCode");
//     let nextCode = "EMP001";

//     if (lastEmployee && lastEmployee.employeeCode) {
//       const lastNum = parseInt(
//         lastEmployee.employeeCode.replace("EMP", ""),
//         10
//       );
//       nextCode = `EMP${String(lastNum + 1).padStart(3, "0")}`;
//     }

//     // ✅ Create new employee
//     const newEmployee = new Employee({
//       company: companyId,
//       firstName,
//       lastName,
//       employeeCode: nextCode,
//       employeeLevel,
//       managerName,
//       managerEmail,
//       email,
//       phoneNumber,
//       whatsappNumber,
//       gender,
//       maritalStatus,
//       dateOfBirth,
//       dateOfJoining,
//       anniversaryDate,
//       primaryAddress,
//       secondaryAddress,
//       pincode,
//       city,
//       state,
//       country,
//       child1Name,
//       child1Gender,
//       child1Dob,
//       child2Name,
//       child2Gender,
//       child2Dob,
//     });

//     if (maritalStatus?.toLowerCase() === "married") {
//       newEmployee.spouseFirstName = spouseFirstName;
//       newEmployee.spouseLastName = spouseLastName;
//       newEmployee.spouseDob = spouseDob;
//       newEmployee.spouseEmail = spouseEmail;
//       newEmployee.spousePhone = spousePhone;
//     }

//     await newEmployee.save();

//     return res.status(201).json({
//       message: "Employee created successfully",
//       employee: newEmployee,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Employee creation failed",
//       error: err.message,
//     });
//   }
// };

// ✅ Create Employee (backend/controllers/employeeController.js)
// exports.createEmployee = async (req, res) => {
//   try {
//     const {
//       companyId,
//       firstName,
//       lastName,
//       employeeLevel,
//       managerName,
//       managerEmail,
//       email,
//       phoneNumber,
//       whatsappNumber,
//       gender,
//       maritalStatus,
//       dateOfBirth,
//       dateOfJoining,
//       anniversaryDate,
//       primaryAddress,
//       secondaryAddress,
//       pincode,
//       city,
//       state,
//       country,
//       spouseFirstName,
//       spouseLastName,
//       spouseEmail,
//       spousePhoneNumber,
//       child1Name,
//       child1Gender,
//       child1Dob,
//       child2Name,
//       child2Gender,
//       child2Dob,
//     } = req.body;

//     if (!companyId) {
//       return res.status(400).json({ message: "Company ID is required." });
//     }

//     // ✅ Find last employee for this company
//     const lastEmployee = await Employee.findOne({ company: companyId }).sort({
//       _id: -1,
//     });
//     let employeeCode = "EMP001";
//     if (lastEmployee && lastEmployee.employeeCode) {
//       const lastNumber = parseInt(
//         lastEmployee.employeeCode.replace("EMP", ""),
//         10
//       );
//       employeeCode = `EMP${String(lastNumber + 1).padStart(3, "0")}`;
//     }

//     // ✅ Handle marital info
//     const spouseInfo =
//       maritalStatus === "Married"
//         ? {
//             spouseFirstName,
//             spouseLastName,
//             spouseEmail,
//             spousePhoneNumber,
//           }
//         : {};

//     // ✅ Create new employee
//     const newEmployee = new Employee({
//       company: companyId,
//       firstName,
//       lastName,
//       employeeCode,
//       employeeLevel,
//       managerName,
//       managerEmail,
//       email,
//       phoneNumber,
//       whatsappNumber,
//       gender,
//       maritalStatus,
//       dateOfBirth,
//       dateOfJoining,
//       anniversaryDate,
//       primaryAddress,
//       secondaryAddress,
//       pincode,
//       city,
//       state,
//       country,
//       ...spouseInfo,
//       child1Name,
//       child1Gender,
//       child1Dob,
//       child2Name,
//       child2Gender,
//       child2Dob,
//     });

//     await newEmployee.save();

//     return res.status(201).json({
//       success: true,
//       message: "Employee created successfully",
//       employee: newEmployee,
//     });
//   } catch (error) {
//     console.error("Error creating employee:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };
const GiftPreference = require("../models/GiftPreference"); // add this import

exports.createEmployee = async (req, res) => {
  try {
    const {
      companyId,
      firstName,
      lastName,
      employeeLevel,
      managerName,
      managerEmail,
      email,
      phoneNumber,
      whatsappNumber,
      gender,
      maritalStatus,
      dateOfBirth,
      dateOfJoining,
      anniversaryDate,
      primaryAddress,
      secondaryAddress,
      pincode,
      city,
      state,
      country,
      spouseFirstName,
      spouseLastName,
      spouseEmail,
      spousePhoneNumber,
      child1Name,
      child1Gender,
      child1Dob,
      child2Name,
      child2Gender,
      child2Dob,
    } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required." });
    }

    // ✅ Find last employee code
    const lastEmployee = await Employee.findOne({ company: companyId }).sort({
      _id: -1,
    });
    let employeeCode = "EMP001";
    if (lastEmployee?.employeeCode) {
      const lastNumber = parseInt(
        lastEmployee.employeeCode.replace("EMP", ""),
        10
      );
      employeeCode = `EMP${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // ✅ Fetch gift preference for this level
    const levelPreference = await GiftPreference.findOne({
      level: employeeLevel,
    });

    // ✅ Handle marital info
    const spouseInfo =
      maritalStatus === "Married"
        ? { spouseFirstName, spouseLastName, spouseEmail, spousePhoneNumber }
        : {};

    // ✅ Create employee with gifts included (if found)
    const newEmployee = new Employee({
      company: companyId,
      firstName,
      lastName,
      employeeCode,
      employeeLevel,
      managerName,
      managerEmail,
      email,
      phoneNumber,
      whatsappNumber,
      gender,
      maritalStatus,
      dateOfBirth,
      dateOfJoining,
      anniversaryDate,
      primaryAddress,
      secondaryAddress,
      pincode,
      city,
      state,
      country,
      ...spouseInfo,
      child1Name,
      child1Gender,
      child1Dob,
      child2Name,
      child2Gender,
      child2Dob,

      edibleGifts:
        levelPreference?.edibleGift?.map((g) => ({
          id: g.id,
          eat_id: g.eat_id,
          description: g.description,
        })) || [],

      customGifts:
        levelPreference?.customGift?.map((g) => ({
          id: g.id,
          custom_id: g.custom_id,
          description: g.description,
        })) || [],
    });

    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getEmployeesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const employees = await Employee.find({ company: companyId });
    res.json(employees);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch employees", error: err.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    Object.assign(emp, req.body);

    if (
      req.body.maritalStatus &&
      req.body.maritalStatus.toLowerCase() !== "married"
    ) {
      // Clear spouse fields if not married
      emp.spouseFirstName = undefined;
      emp.spouseLastName = undefined;
      emp.spouseDob = undefined;
      emp.spouseEmail = undefined;
      emp.spousePhone = undefined;
    }

    await emp.save();
    res.json({ message: "Employee updated", employee: emp });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update employee", error: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    await emp.deleteOne();
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete employee", error: err.message });
  }
};
const xlsx = require("xlsx");

exports.bulkUploadEmployees = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const companyId = req.body.company || req.user?.company;
    if (!companyId) {
      return res.status(400).json({ message: "Company is required" });
    }

    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    let errors = [];
    let employees = [];

    // 🔹 Define required fields
    const requiredFields = [
      "First Name",
      "Last Name",
      "Employee Level",
      "Manager Name",
      "Manager Email ID",
      "Employee Email ID",
      "Phone Number",
      "WhatsApp Number",
      "Gender",
      "Marital Status",
      "Date of Birth",
      "Date of Joining",
      "Primary Address",
      "Pincode",
      "City",
      "State",
      "Country",
    ];

    // 🔹 Find the last employee to continue numbering
    const lastEmployee = await Employee.findOne()
      .sort({ createdAt: -1 })
      .select("employeeCode");
    let baseNumber = 0;

    if (lastEmployee && lastEmployee.employeeCode) {
      const lastNum = parseInt(
        lastEmployee.employeeCode.replace("EMP", ""),
        10
      );
      baseNumber = isNaN(lastNum) ? 0 : lastNum;
    }

    // 🔹 Loop through Excel rows
    for (let i = 0; i < jsonData.length; i++) {
      const data = jsonData[i];
      let missingFields = [];

      // ✅ Check missing fields
      requiredFields.forEach((field) => {
        if (!data[field] || data[field].toString().trim() === "") {
          missingFields.push(`${field} is required`);
        }
      });

      if (missingFields.length > 0) {
        errors.push(`Row ${i + 2}: ${missingFields.join(", ")}`);
        continue;
      }

      // ✅ Generate next Employee Code automatically
      const nextCode = `EMP${String(baseNumber + i + 1).padStart(3, "0")}`;
      const levelPreference = await GiftPreference.findOne({
        level: data["Employee Level"],
      });

      employees.push({
        company: companyId,
        firstName: data["First Name"],
        lastName: data["Last Name"],
        employeeCode: nextCode, // ✅ auto-generated
        employeeLevel: data["Employee Level"],
        managerName: data["Manager Name"],
        managerEmail: data["Manager Email ID"],
        email: data["Employee Email ID"],
        phoneNumber: data["Phone Number"],
        whatsappNumber: data["WhatsApp Number"],
        gender: data["Gender"],
        maritalStatus: data["Marital Status"],
        dateOfBirth: data["Date of Birth"]
          ? new Date(data["Date of Birth"])
          : null,
        dateOfJoining: data["Date of Joining"]
          ? new Date(data["Date of Joining"])
          : null,
        anniversaryDate: data["Anniversary Date"]
          ? new Date(data["Anniversary Date"])
          : null,
        primaryAddress: data["Primary Address"],
        secondaryAddress: data["Secondary Address"],
        pincode: data["Pincode"],
        city: data["City"],
        state: data["State"],
        country: data["Country"],

        edibleGifts:
          levelPreference?.edibleGift?.map((g) => ({
            id: g.id,
            eat_id: g.eat_id,
            description: g.description,
          })) || [],

        customGifts:
          levelPreference?.customGift?.map((g) => ({
            id: g.id,
            custom_id: g.custom_id,
            description: g.description,
          })) || [],

        // ✅ Add spouse details if married
        spouseFirstName:
          data["Marital Status"] === "Married"
            ? data["Spouse First Name"]
            : undefined,
        spouseLastName:
          data["Marital Status"] === "Married"
            ? data["Spouse Last Name"]
            : undefined,
        spouseDob:
          data["Marital Status"] === "Married" && data["Spouse Date of Birth"]
            ? new Date(data["Spouse Date of Birth"])
            : undefined,
        spouseEmail:
          data["Marital Status"] === "Married"
            ? data["Spouse Email ID"]
            : undefined,
        spousePhone:
          data["Marital Status"] === "Married"
            ? data["Spouse Phone Number"]
            : undefined,

        // ✅ Child details
        child1Name: data["Child 1 Name"],
        child1Gender: data["Child 1 Gender"],
        child1Dob: data["Child 1 Date of Birth"]
          ? new Date(data["Child 1 Date of Birth"])
          : undefined,

        child2Name: data["Child 2 Name"],
        child2Gender: data["Child 2 Gender"],
        child2Dob: data["Child 2 Date of Birth"]
          ? new Date(data["Child 2 Date of Birth"])
          : undefined,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation errors found",
        errors,
      });
    }

    // 🔹 Check for duplicates by email, phone, whatsapp
    const existingEmployees = await Employee.find({
      $or: [
        { email: { $in: employees.map((e) => e.email) } },
        { phoneNumber: { $in: employees.map((e) => e.phoneNumber) } },
        { whatsappNumber: { $in: employees.map((e) => e.whatsappNumber) } },
      ],
    });

    if (existingEmployees.length > 0) {
      let duplicateErrors = existingEmployees.map((emp) => {
        return `Duplicate found: ${
          emp.email || emp.phoneNumber || emp.whatsappNumber
        }`;
      });

      return res.status(400).json({
        message: "Duplicate entries found",
        errors: duplicateErrors,
      });
    }

    // ✅ Insert all valid employees
    await Employee.insertMany(employees);

    res.status(201).json({
      message: "Employees uploaded successfully",
      count: employees.length,
      sampleCodes: employees.slice(0, 3).map((e) => e.employeeCode), // just to confirm codes
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({
      message: "Error uploading employees",
      error: err.message,
    });
  }
};

// exports.bulkUploadEmployees = async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const companyId = req.body.company || req.user?.company;
//     if (!companyId) {
//       return res.status(400).json({ message: "Company is required" });
//     }

//     const workbook = xlsx.readFile(file.path);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     let errors = [];
//     let employees = [];

//     // 🔹 Define required fields
//     const requiredFields = [
//       "First Name",
//       "Last Name",
//       "Employee Code",
//       "Employee Level",
//       "Manager Name",
//       "Manager Email ID",
//       "Employee Email ID",
//       "Phone Number",
//       "WhatsApp Number",
//       "Gender",
//       "Marital Status",
//       "Date of Birth",
//       "Date of Joining",
//       "Primary Address",
//       "Pincode",
//       "City",
//       "State",
//       "Country",
//     ];

//     // 🔹 Loop through Excel rows
//     for (let i = 0; i < jsonData.length; i++) {
//       const data = jsonData[i];
//       let missingFields = [];

//       // ✅ Check missing fields
//       requiredFields.forEach((field) => {
//         if (!data[field] || data[field].toString().trim() === "") {
//           missingFields.push(`${field} is required`);
//         }
//       });

//       if (missingFields.length > 0) {
//         errors.push(`Row ${i + 2}: ${missingFields.join(", ")}`);
//         continue; // skip this row
//       }

//       employees.push({
//         company: companyId,
//         firstName: data["First Name"],
//         lastName: data["Last Name"],
//         employeeCode: data["Employee Code"],
//         employeeLevel: data["Employee Level"],
//         managerName: data["Manager Name"],
//         managerEmail: data["Manager Email ID"],
//         email: data["Employee Email ID"],
//         phoneNumber: data["Phone Number"],
//         whatsappNumber: data["WhatsApp Number"],
//         gender: data["Gender"],
//         maritalStatus: data["Marital Status"],
//         dob: data["Date of Birth"],
//         doj: data["Date of Joining"],
//         anniversary: data["Anniversary Date"],
//         address1: data["Primary Address"],
//         address2: data["Secondary Address"],
//         pincode: data["Pincode"],
//         city: data["City"],
//         state: data["State"],
//         country: data["Country"],
//         spouseDetails:
//           data["Marital Status"] === "Married"
//             ? {
//                 firstName: data["Spouse First Name"],
//                 lastName: data["Spouse Last Name"],
//                 dob: data["Spouse Date of Birth"],
//                 email: data["Spouse Email ID"],
//                 phoneNumber: data["Spouse Phone Number"],
//               }
//             : null,
//         children: [
//           {
//             name: data["Child 1 Name"],
//             gender: data["Child 1 Gender"],
//             dob: data["Child 1 Date of Birth"],
//           },
//           {
//             name: data["Child 2 Name"],
//             gender: data["Child 2 Gender"],
//             dob: data["Child 2 Date of Birth"],
//           },
//         ],
//       });
//     }

//     if (errors.length > 0) {
//       return res.status(400).json({
//         message: "Validation errors found",
//         errors,
//       });
//     }

//     // 🔹 Check duplicate email / phone / whatsapp / employeeCode
//     const existingEmployees = await Employee.find({
//       $or: [
//         { email: { $in: employees.map((e) => e.email) } },
//         { phoneNumber: { $in: employees.map((e) => e.phoneNumber) } },
//         { whatsappNumber: { $in: employees.map((e) => e.whatsappNumber) } },
//         { employeeCode: { $in: employees.map((e) => e.employeeCode) } },
//       ],
//     });

//     if (existingEmployees.length > 0) {
//       let duplicateErrors = existingEmployees.map((emp) => {
//         return `Duplicate found: ${emp.email || emp.phoneNumber || emp.whatsappNumber || emp.employeeCode}`;
//       });

//       return res.status(400).json({
//         message: "Duplicate entries found",
//         errors: duplicateErrors,
//       });
//     }

//     // ✅ Insert valid employees
//     await Employee.insertMany(employees);

//     res.status(201).json({
//       message: "Employees uploaded successfully",
//       count: employees.length,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error uploading employees",
//       error: err.message,
//     });
//   }
// };

// SCHEDULER
exports.getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const next7 = new Date();
    next7.setDate(today.getDate() + 7);

    const employees = await Employee.find().populate("company");
    const upcomingEvents = [];

    employees.forEach((emp) => {
      const events = [];

      if (emp.dateOfBirth) {
        const dob = new Date(emp.dateOfBirth);
        const thisYearDob = new Date(
          today.getFullYear(),
          dob.getMonth(),
          dob.getDate()
        );
        if (thisYearDob >= today && thisYearDob <= next7) {
          events.push({ occasion: "Birthday", eventDate: thisYearDob });
        }
      }

      if (emp.dateOfJoining) {
        const doj = new Date(emp.dateOfJoining);
        const workAnniv = new Date(
          today.getFullYear(),
          doj.getMonth(),
          doj.getDate()
        );
        if (workAnniv >= today && workAnniv <= next7) {
          events.push({ occasion: "Work Anniversary", eventDate: workAnniv });
        }
      }

      if (emp.anniversaryDate) {
        const anniv = new Date(emp.anniversaryDate);
        const weddingAnniv = new Date(
          today.getFullYear(),
          anniv.getMonth(),
          anniv.getDate()
        );
        if (weddingAnniv >= today && weddingAnniv <= next7) {
          events.push({
            occasion: "Wedding Anniversary",
            eventDate: weddingAnniv,
          });
        }
      }

      events.forEach((e) => {
        upcomingEvents.push({
          eventDate: e.eventDate.toISOString().split("T")[0],
          occasion: e.occasion,
          nameOfEmployee: `${emp.firstName} ${emp.lastName}`,
          companyName: emp.company?.name || "N/A",
          relation: "Employee",
        });
      });
    });

    res.json(upcomingEvents);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const employee = await Employee.findById(id)
      .populate("company") // if you want company details
      .exec();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee details fetched successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const GiftPreference = require("../models/GiftPreference");

// // Save preferences (can be multiple entries at once)
// exports.saveGiftPreferences = async (req, res) => {
//   try {
//     const preferences = req.body;

//     if (!Array.isArray(preferences)) {
//       return res.status(400).json({ message: "Invalid input format." });
//     }

//     // Save or update each preference
//     const saved = await Promise.all(
//       preferences.map(async (pref) => {
//         const { occasionType, personType } = pref;

//         // Check if a record already exists for this occasionType + personType
//         const existing = await GiftPreference.findOne({
//           occasionType,
//           personType,
//         });

//         if (existing) {
//           return await GiftPreference.findOneAndUpdate(
//             { occasionType, personType },
//             pref,
//             { new: true }
//           );
//         } else {
//           const newPref = new GiftPreference(pref);
//           return await newPref.save();
//         }
//       })
//     );

//     res
//       .status(200)
//       .json({ message: "Preferences saved successfully", data: saved });
//   } catch (error) {
//     console.error("Error saving preferences:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Get preferences by occasion
// exports.getPreferencesByOccasion = async (req, res) => {
//   const { occasionType } = req.params;

//   try {
//     const data = await GiftPreference.find({ occasionType });
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error fetching preferences:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// Save preferences (can be multiple entries at once)

exports.saveGiftPreferences = async (req, res) => {
  try {
    const preferences = req.body;

    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: "Invalid input format." });
    }

    const saved = await Promise.all(
      preferences.map(async (pref) => {
        const { occasionType, personType, level } = pref;

        // ✅ Check existing based on occasion + personType + level
        const existing = await GiftPreference.findOne({
          occasionType,
          personType,
          level,
        });

        if (existing) {
          return await GiftPreference.findOneAndUpdate(
            { occasionType, personType, level },
            pref,
            { new: true }
          );
        } else {
          const newPref = new GiftPreference(pref);
          return await newPref.save();
        }
      })
    );

    res.status(200).json({
      message: "Preferences saved successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get preferences by occasion
exports.getPreferencesByOccasion = async (req, res) => {
  const { occasionType } = req.params;

  try {
    const data = await GiftPreference.find({ occasionType });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

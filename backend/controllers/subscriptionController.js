const SubscriptionPreference = require('../models/SubscriptionPreference');

// Save subscription preferences (bulk or individual)
exports.saveSubscriptions = async (req, res) => {
  try {
    const subscriptions = req.body;

    if (!Array.isArray(subscriptions)) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    const saved = await Promise.all(
      subscriptions.map(async (sub) => {
        const { personType, company } = sub;

        // check by company + personType (so each company can have its own subscription types)
        const existing = await SubscriptionPreference.findOne({ personType, company });

        if (existing) {
          return await SubscriptionPreference.findOneAndUpdate(
            { personType, company },
            sub,
            { new: true }
          );
        } else {
          const newSub = new SubscriptionPreference(sub);
          return await newSub.save();
        }
      })
    );

    res.status(200).json({ message: 'Subscriptions saved successfully', data: saved });
  } catch (error) {
    console.error('Error saving subscriptions:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all subscription preferences (with company info)
exports.getSubscriptions = async (req, res) => {
  try {
    const data = await SubscriptionPreference.find().populate("company");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
};

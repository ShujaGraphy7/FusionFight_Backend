// controllers/userController.js

const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "username walletAddress wonMatches lostMatches totalMatches totalPoints lastTokenUpdate"
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, walletAddress } = req.body;

    // Check if a user with the same wallet address already exists
    const existingUser = await User.findOne({ walletAddress });

    if (existingUser) {
      // If a user with the same wallet address exists, throw an error
      return res
        .status(400)
        .json({ message: "User with this wallet address already exists" });
    }

    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Create a new user
    const newUser = new User({
      username,
      walletAddress: lowercaseWalletAddress,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateWonMatch = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Increment the wonMatches and totalMatches counters for the specified user
    await User.findOneAndUpdate(
      { walletAddress: lowercaseWalletAddress },
      { $inc: { wonMatches: 1, totalMatches: 1, totalPoints: 2 } }
    );

    res.status(200).json({ message: "Won match updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateLostMatch = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Increment the lostMatches and totalMatches counters for the specified user
    await User.findOneAndUpdate(
      { walletAddress: lowercaseWalletAddress },
      { $inc: { lostMatches: 1, totalMatches: 1 } }
    );

    res.status(200).json({ message: "Lost match updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Fetch user details based on wallet address
    const userDetails = await User.findOne(
      { walletAddress: lowercaseWalletAddress },
      "username walletAddress wonMatches lostMatches totalMatches totalPoints lastTokenUpdate"
    );

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserPoints = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Get the current timestamp
    const currentTime = Date.now();

    // Convert the wallet address to lowercase for case-insensitive search
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Find the current user using a case-insensitive search
    const currentUser = await User.findOne(
      { walletAddress: lowercaseWalletAddress },
      "walletAddress totalPoints lastTokenUpdate"
    );

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { lastTokenUpdate } = currentUser;

    // Calculate time difference in hours
    const timeDifferenceHours =
      (currentTime - lastTokenUpdate) / (1000 * 60 * 60);

    // Update total points only if 24 hours have passed since the last match
    if (timeDifferenceHours >= 24) {
      await User.findOneAndUpdate(
        { walletAddress: lowercaseWalletAddress },
        { $inc: { totalPoints: 5 }, lastTokenUpdate: currentTime }
      );

      res.status(200).json({ message: "User points updated successfully" });
    } else {
      res
        .status(400)
        .json({ message: "User can receive bonus once in 24 hours" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.isEligible = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Find the user by wallet address
    const user = await User.findOne({ walletAddress: lowercaseWalletAddress }, "walletAddress lastTokenUpdate");

    if (!user) {
      return res.status(404).json({ message: "User has not Started a battle", data: { is_ok: false } });
    }

    // Get the current timestamp
    const { lastTokenUpdate } = user;

    // Calculate the timestamp representing 24 hours ago
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

    const isOk = lastTokenUpdate > twentyFourHoursAgo;

    res.status(200).json({ data: { is_ok: isOk } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.isRegisteredUser = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const lowercaseWalletAddress = walletAddress.toLowerCase();

    // Find the user by wallet address
    const user = await User.findOne({ walletAddress:lowercaseWalletAddress });

    if (!user) {
      return res.status(404).json({data: { is_ok: false }  });
    }


    res.status(200).json({ data: { is_ok: true } });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

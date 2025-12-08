import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      password,
      email: email.toLowerCase(),
      loggedIn: false,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully",mail:email,password:password });

  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

 //compare password
    const ismatch = await user.comparePassword(password);
    if(!ismatch)
    {
      return res.status(400).json({
        message:"Invalid password"
      })
    }
    
    return res.status(200).json({ message: "Login successful" ,user});

  } catch (error) {
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
};


export { registerUser,loginUser};

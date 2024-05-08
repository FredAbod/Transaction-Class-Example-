import { errorResMsg, successResMsg } from "../lib/response.js";
import {
  checkExistingPassword,
  checkExistingUser,
} from "../middleware/services.js";
import User from "../models/user.models.js";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return errorResMsg(res, 400, "Please Input Username or Email");
    }
    const existingUser = await checkExistingUser(email);
    if (existingUser) {
      return errorResMsg(res, 400, "User Already Exists");
    }

    const newUser = await User.create({
      userName,
      email,
      password,
    });

    return successResMsg(res, 201, {
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find User By Email
    const user = await checkExistingUser(email);
    if (!user) {
      return errorResMsg(res, 400, "User not found");
    }
    const passwordMatch = await checkExistingPassword(password, user);
    if (!passwordMatch) {
      return errorResMsg(res, 400, "Password Does Not Match");
    }

    const token = user.generateAuthToken();

    return successResMsg(res, 200, {
      success: true,
      data: token,
      message: "User Logged In Successfully",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

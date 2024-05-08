import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
      userName: {
        type: String,
        required: [true, "UserName Is Required"],
      },
      email: {
        type: String,
        required: [true, "Email Is Required"],
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: [true, "Password Is Required"],
      },
      accountNumber: {
        type: String,
        unique: true,
      },
      balance: {
        type: mongoose.Decimal128,
        default: 0,
      },
      balanceBefore: {
        type: mongoose.Decimal128,
        default: 0,
      },
      balanceAfter: {
        type: mongoose.Decimal128,
        default: 0,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
);
// Function to generate a random 10-digit number
function generateRandomNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
}

// Hash the password before saving
userSchema.pre("save", async function (next) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      
      // Generate unique account number if not already set
      if (!this.accountNumber) {
        let generatedNumber;
        let isUnique = false;
        while (!isUnique) {
          generatedNumber = generateRandomNumber();
          const existingUser = await mongoose.model("User").findOne({ accountNumber: generatedNumber });
          if (!existingUser) {
            isUnique = true;
          }
        }
        this.accountNumber = generatedNumber;
      }
      
      next();
    } catch (error) {
      next(error);
    }
});

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN, // You can adjust the expiration time
    });
    return token;
};


const User = mongoose.model("User", userSchema);

export default User;

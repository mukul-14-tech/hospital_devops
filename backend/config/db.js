const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  }catch (error) {
  console.error("DB Error:", error);

  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
}
};

module.exports = connectDB;
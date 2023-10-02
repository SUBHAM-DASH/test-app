const mongoose = require("mongoose");

exports.connectToMongoose = async () => {
  const url = process.env.MONGOURL;
  try {
    await mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewurlParser: true,
      });
      console.log("connect with mongo successfully!");
  } catch (error) {
    console.log(error.message);
    console.log("Error Occoured While Connecting With MongoDB");
  }
};

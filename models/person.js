const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

// Establish MongoDB connection
console.log("connecting to", url);
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

// Format the returned data. Remove _id-object and return a string id instead. Also remove the MondoDB version.
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);

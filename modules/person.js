const mongoose = require("mongoose");
require("dotenv").config();
var uniqueValidator = require("mongoose-unique-validator");

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

// Schema with validation rules.
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 5,
        required: true,
        unique: true,
    },
});

// Format the returned data. Remove _id-object and return a string id instead. Also remove the MondoDB version.
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Register the validator for duplicate data.
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);

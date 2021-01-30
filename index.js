const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

// General info
app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has data of ${persons.length} people</p>
        <p>${new Date().toLocaleString()}</p>`
    );
});

// Get all entries
app.get("/api/persons", (req, res) => {
    Person.find({})
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err));
});

// Get a single entry
app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
        .then((result) => {
            if (result === null) {
                res.status(404).end();
            } else {
                res.send(result);
            }
        })
        .catch((err) => console.log(err));
});

// Enter new data
app.post("/api/persons", (req, res, next) => {
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
    };

    console.log("Data received in the POST-request:", newPerson);

    // Save the new person to the DB
    var document = new Person(newPerson);

    document
        .save()
        .then((savedData) => {
            console.log(savedData, "Added to phonebook");
            res.json(savedData);
        })
        .catch((error) => next(error));
});

// Delete an entry
app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(204).end();
        });
});

// Update an entry
app.put("/api/persons/:id", (req, res) => {
    Person.findByIdAndUpdate(req.params.id, req.body)
        .then((updatedData) => {
            console.log(updatedData, "Data updated");
            res.json(updatedData);
        })
        .catch((err) => console.log(err));
});

// Error handling middleware. Simply sends a pre-formatted message to the client.
const errorHandler = (error, request, response, next) => {
    const nameError = error.errors.name;
    const numberError = error.errors.number;
    console.log(error.errors.name);
    console.log(error.errors.number);

    let errMsg = "";

    if (error.name === "CastError") {
        return response.status(400).json({ errorMessage: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        // Name error handling.
        if (typeof nameError !== "undefined") {
            if (nameError.properties.type === "required") {
                errMsg = "Name input is required.";
            } else if (nameError.properties.type === "minlength") {
                errMsg = "Name minimum length is 3 characters.";
            } else if (nameError.properties.type === "unique") {
                errMsg = "Duplicate name.";
            }
        }
        // Number error handling
        if (typeof numberError !== "undefined") {
            if (numberError.properties.type === "required") {
                errMsg = `${errMsg} Number input is required.`;
            } else if (numberError.properties.type === "minlength") {
                errMsg = `${errMsg} Number minimum length is 5 characters.`;
            } else if (numberError.properties.type === "unique") {
                errMsg = `${errMsg} Duplicate number.`;
            }
        }
        console.log(errMsg);
        return response.status(400).json({ errorMessage: errMsg });
    }

    next(error);
};

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("App listening");
});

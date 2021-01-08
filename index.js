const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./modules/person");

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
            console.log("All entries retrieved from the database");
            res.send(result);
        })
        .catch((err) => console.log(err));
});

// Get a single entry
app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id).then((result) => {
        if (!person) {
            res.status(404).end();
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

// Enter new data
app.post("/api/persons", (req, res) => {
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
    };

    console.log("Data received in the POST-request:", newPerson);

    /*     // Find matches for the given name or phone number in the database.
    const nameMatches = Person.find({ name: newPerson.name });
    const numberMatches = Person.find({ number: newPerson.number });

    // Check for missing data
    if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({
            error: "Data missing",
        });
        // Check for duplicate name
    } else if (nameMatches.length !== 0) {
        return res.status(400).json({
            error: "Duplicate name",
        });
        // Check for duplicate number
    } else if (numberMatches.length !== 0) {
        return res.status(400).json({
            error: "Duplicate number",
        });
    } */

    // Save the new person to the DB

    var document = new Person(newPerson);

    document
        .save()
        .then((savedData) => {
            console.log(result, "Added to phonebook");
            res.json(savedData);
        })
        .catch((err) => console.log(err));
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

const port = process.env.PORT;
app.listen(port, () => {
    console.log("App listening");
});

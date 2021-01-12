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

// Error handling middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

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
    Person.findById(req.params.id)
        .then((result) => {
            if (result === null) {
                res.status(404).end();
            } else {
                console.log(result);
                res.send(result);
            }
        })
        .catch((err) => console.log(err));
});

// Enter new data
app.post("/api/persons", (req, res) => {
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
        .catch((err) => next(err));
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

const port = process.env.PORT;
app.listen(port, () => {
    console.log("App listening");
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-456938",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "040-485140",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "040-098453",
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "040-183927",
    },
];

app.get("/", (req, res) => {
    res.send("index");
});

// General info
app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has data of ${persons.length} people</p>
        <p>${new Date().toLocaleString()}</p>`
    );
});

// Get all entries
app.get("/api/persons", (req, res) => {
    res.send(persons);
});

// Get a single entry
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (!person) {
        res.status(404).end();
    } else {
        res.send(person);
    }
});

// Post a new entry
app.post("/api/persons", (req, res) => {
    const newPerson = {
        id: Math.floor(Math.random() * Math.floor(1000)),
        name: req.body.name,
        number: req.body.number,
    };

    const nameMatch = persons.find((person) => person.name === newPerson.name);
    const numberMatch = persons.find((person) => person.number === newPerson.number);

    // Check for missing data
    if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({
            error: "Data missing",
        });
        // Check for duplicate name
    } else if (typeof nameMatch !== "undefined") {
        return res.status(400).json({
            error: "Duplicate name",
        });
        // Check for duplicate number
    } else if (typeof numberMatch !== "undefined") {
        return res.status(400).json({
            error: "Duplicate number",
        });
    }

    persons.push(newPerson);
    res.json(newPerson);
});

// Delete an entry
app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

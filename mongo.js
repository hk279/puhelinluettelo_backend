const mongoose = require("mongoose");

// Password has to be given as a command line parameter.
if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

// Password is the third parameter, for example: node mongo <password>
const password = process.argv[2];

const url = `mongodb+srv://user-1:${password}@cluster0.eowip.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
    console.log("Connected to the database");
});

// Create a data structure (schema)
const person = new mongoose.Schema({
    name: String,
    number: String,
});

// Create a model tha is used to create new documents
const Person = mongoose.model("Person", person);

// Name and number to be added are given as command line args
const name = process.argv[3];
const number = process.argv[4];

// If no name or number is given, all contents of the phonebook are logged into the console
if (process.argv.length === 3) {
    Person.find({}).then((res) => {
        console.log("phonebook:");
        res.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
    });
    return;
}

// Create a new person document and save it. Connection is closed after.
const newPerson = new Person({ name: name, number: number });
newPerson
    .save()
    .then((res) => {
        console.log(`Added ${name} ${number} to phonebook`);
        mongoose.connection.close();
    })
    .catch((err) => console.error(err));

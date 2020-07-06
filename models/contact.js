const mongoose = require('mongoose')

// Database connection settings
const password = "KOXJUC7TOmS2x2DX" // pw won't work yet, want to grab correctly
const db_name = "phonebook_app"
const url = 
    `mongodb+srv://fullstack:${password}@cluster0-fieq2.mongodb.net/${db_name}?retryWrites=true`

console.log("Connecting to", url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error.message)
    })

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
	date: Date,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Contact', contactSchema)
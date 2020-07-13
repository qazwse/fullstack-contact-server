const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)
console.log("Connecting to", url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(result => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error.message)
    })

const contactSchema = new mongoose.Schema({
	  name: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
	  number: {
        type: String,
        minlength: 8,
        required: true
    },
	  date: Date,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

contactSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Contact', contactSchema)

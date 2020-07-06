const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log('Please provide the password.')
	process.exit(1)
}

const password = process.argv[2]
const db_name = "phonebook_app"
const url = 
	`mongodb+srv://fullstack:${password}@cluster0-fieq2.mongodb.net/${db_name}?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
	date: Date,
})

const Contact = mongoose.model('Contact', contactSchema)


if (process.argv.length == 3) {
	Contact.find({}).then(result => {
		result.forEach(note => {
			console.log(note)
		})
		mongoose.connection.close()
	})
} else if (process.length < 5) {
	console.log('Please provide the contact name and number.')
	process.exit(1)
} else {
	const name = process.argv[3]
	const number = process.argv[4]

	const contact = new Contact({
		name: name,
		number: number,
		date: new Date(),
	})

	contact.save().then(result => {
		console.log(`${name} added number ${number} to phonebook`)
		mongoose.connection.close()
	})
}







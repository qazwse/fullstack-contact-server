require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')

morgan.token('body', function getBody(req) {
    const body = req.body
    if (Object.getOwnPropertyNames(body).length > 0) {
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint'
    })
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    }

    next(error)
}

app.get('/', (req, res) => {
    res.send('<h1>Index</h1>')
})

app.get('/info', (req, res) => {
    let time = new Date()
    let num_c = 0

    Contact.find({}).then(c => {
        num_c = c.length
    })
    res.send(
        `<p>Phonebook has ${num_c} contacts.</p>
        <p>${time.toString()}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(c => {
        res.json(c)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            if (contact) {
                res.json(contact)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const contact = {
        name: body.name,
        number: body.number,
        date: new Date()
    }

    Contact.findByIdAndUpdate(req.params.id, contact, {new: true})
        .then(updatedContact => {
            res.json(updatedContact)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'Contact name is required'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'Contact number is required'
        })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
        date: new Date()
    })

    contact.save().then(savedContact => {
        res.json(savedContact)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

let port = process.env.PORT
if (port === "" || port === "null" || port === undefined) {
    port = 3001
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

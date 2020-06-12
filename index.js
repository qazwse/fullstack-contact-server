const express = require('express')
const app = express()

app.use(express.json())

const contacts = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Index</h1>')
})

app.get('/info', (req, res) => {
    let time = new Date()
    let num_c = contacts.length
    res.send(
        `<p>Phonebook has ${num_c} contacts.</p>
        <p>${time.toString()}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(c => c.id === id)
    if (contact) {
        res.json(contact)        
    } else {
        res.status(404).end()
    }
})


const port = 3001
app.listen(port, () => { 
    console.log(`Server running on port ${port}`)
})
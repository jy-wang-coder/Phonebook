const http = require('http') 
const morgan = require('morgan')
const express = require('express')
const { log } = require('console')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json()) 
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
//To define a token, simply invoke morgan.token() with the name and a callback function. This callback function is expected to return a string value. The value returned is then available as ":type" in this case:


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = (max) => {
    const randomId = Math.floor(Math.random() * max)
    return randomId
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const num = persons.length
    const t = Date()
    console.log(num);
    response.send(
        `<h3>Phonebook has info for ${num} people</h3>
        <h3>${t}</h3>
        `)
        console.log(t);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error:'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error:'number missing'
        })
    }

    const names = persons.map(p => p.name)

    if (names.includes(body.name)){
        return response.status(400).json({
            error:'name must be unique'
        })
    }

    const newperson = {
        id : generateId(10000000),
        name : body.name,
        number: body.number,
    }

    persons = persons.concat(newperson)
    response.json(persons)
})



const PORT = process.env.PORT || 3001
//Now we are using the port defined in the environment variable PORT or port 3001 if the environment variable PORT is undefined. Fly.io and Render configure the application port based on that environment variable.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()

const http = require('http') 
const morgan = require('morgan')
const express = require('express')
const { log } = require('console')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

const errorHandler = (error, request, response, next) =>{
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
      }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(cors())
app.use(express.json()) //这是一个express 中间件的功能，主要作用处理请求中的json数据，并挂载在body中。
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
//To define a token, simply invoke morgan.token() with the name and a callback function. This callback function is expected to return a string value. The value returned is then available as ":type" in this case:
app.use(express.static('build')) //为了提供对静态资源文件(图片、csss文件、javascript文件)的服务


app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        response.json(result)
      })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
    .then((num) =>{
        console.log({num});
        const t = Date()
        response.send(
            `<h3>Phonebook has info for ${num} people</h3>
            <h3>${t}</h3>
            `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then((person) =>{
        if(person){
            return response.json(person)
        } else {
            response.status(404).end()
        } 
    })
    .catch(error =>{
        next(error)
    })
})

app.post('/api/persons', (request, response, next) => {

    const body = request.body

    console.log('this');

    const newperson = new Person({
        name : body.name,
        number: body.number,
    })

    newperson.save()
    .then(savedPerson => {
      console.log(`add ${savedPerson.name} ${savedPerson.number} to phonebook`)
      return response.json(newperson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) =>{
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} =request.body //need to modify
    console.log('enter put')

    Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true , runValidators: true, context: 'query' })
    .then(updatedPerson => {
        console.log('enter updatedPerson')
        console.log({updatedPerson})
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use(errorHandler)
app.use(unknownEndpoint)



const PORT = process.env.PORT || 3001
//Now we are using the port defined in the environment variable PORT or port 3001 if the environment variable PORT is undefined. Fly.io and Render configure the application port based on that environment variable.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jiayunvv:${password}@cluster0.fp3ubpy.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
}) //新建schema

const Person = mongoose.model('Person', personSchema) //抽象一个模型


if (process.argv[3] && process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  console.log(`save ${person.name}`);
  person.save().then(result => {
    console.log(`add ${person.name} ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}



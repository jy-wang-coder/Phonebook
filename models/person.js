const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })



const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:5,
    required:true},
  number: {
    type:String,
    minLength:8,
    validate: {
    validator: function (v) {
      return /\d{3}-\d{3}-\d{4}/.test(v);
    },
    message: props => `${props.value} is not a valid phone number!`
      },
    required:true
    }
}) //新建schema

//We may need to perform a transformation of the resulting object based on some criteria, say to remove some sensitive information or return a custom object. In this case we set the optional transform function.
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)
// 不导出整个文件，导出部分object
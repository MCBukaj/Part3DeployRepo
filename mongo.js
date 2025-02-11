const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const PersonName=process.argv[3]
const PersonNumber= process.argv[4]
const url =
  `mongodb+srv://bukajfullstack:${password}@cluster1.menjafx.mongodb.net/persons?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phoneEntrySchema)

const person = new Person({
  name: PersonName,
  number: PersonNumber
})



 
const listAll=()=>{
    console.log('phonebook:')
    
    Person.find().then(result=>{
        result.forEach(resultPerson=>{
        console.log(`${resultPerson}`)
        })
         mongoose.connection.close()
    })
    .catch(error=>{consloe.log("error")})
   
    
}

if(process.argv.length<5){
    
    listAll()
    process.exit(1)
}


person.save().then(result => {
  console.log(`added ${PersonName} number ${PersonNumber} to phonebook`)
  mongoose.connection.close()
})


const express = require("express")
const app = express()
const Person= require("./models/person")


const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
var morgan = require('morgan')
const person = require("./models/person")

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.get('/info', async(request, response) => {
  
  const phonebookSize=(await Person.find({})).length
  response.send(`Phonebook has info for ${phonebookSize} perons <br/>${Date()}`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=>{
    response.json(persons)
  })
  
})
app.get('/api/persons/:id', (request, response,next) => {
    const id =request.params.id
    Person.findById(request.params.id)
    .then(person => {
      if(person)
        return response.json(person)

      response.sendStatus(404).end()
      
    })
    .catch(error=>{next(error)})
  })

app.delete('/api/persons/:id',(request,response,next)=>{
  
    const id =request.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
      response.status(200).json(result.toJSON()).end()
    })
    .catch(error=>{next(error)})
  
  
    
    
     
})

app.post('/api/persons',(request,response,next)=>{

    const body = request.body

    if (body.name==null && body.number==null) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }

    const person = new Person ({
      name: body.name,
      number:body.number
    })
  
    person.save().then(result=>{
      console.log('Saved',result)
      response.json(result.toJSON())

    })
    .catch(error=>{next(error)})
    

})

app.put('/api/persons/:id',(request,response,next)=>{

  const id =request.params.id
  Person.findByIdAndUpdate(id,{number:request.body.number},{new:true,runValidators:true})
  .then(result=>{response.json(result.toJSON())})
  .catch(error=>{next(error)})

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
  
}


app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if(error.name==='CastError')
    response.status(400).send({error:'malformed id'}).end()
  else if(error.name==='ValidationError')
    response.status(400).send({error:error.message}).end()
  else if(error.name==="TypeError")
    response.status(400).send({error:'malformed body'}).end()
  next(error)
}


app.use(errorHandler)

const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
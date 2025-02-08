const express = require("express")
const app = express()



const generateId = ()=>{
    const min= persons.length+1
    const max=1000000;
    return Math.floor(Math.random() * (max - min) + min);
}
let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(express.static('dist'))
var morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} perons <br/>${Date()}`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id =request.params.id
    if(!validateId(id))
        response.sendStatus(404).end()
    response.json(persons[id-1])
  })

app.delete('/api/persons/:id',(request,response)=>{
    const id =request.params.id
    const personToDelete=persons.find(person=>person.id==id)
    persons=persons.filter(person=>person.id!=id)
    
    if(personToDelete!=null)
      return response.status(200).json(personToDelete).end()

    response.status(404).json({error:'person does not exists'}).end()
    
     
})

app.post('/api/persons',(request,response)=>{

    const body = request.body

    if (body.name==null && body.number==null) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    else if(persons.find(person=>person.name==body.name)){
        return response.status(400).json({
            error:'name must be unique'
        })
    }
    const person = {
      name: body.name,
      number:body.number,
      id: String(generateId()),
    }
  
    persons = persons.concat(person)
  
    response.json(person)

})
const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
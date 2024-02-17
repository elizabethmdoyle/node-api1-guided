// IMPORTS AT THE TOP
const express = require('express')
const Dog = require('./dog-model') 

// INSTANCE OF EXPRESS APP
const server = express()
// GLOBAL MIDDLEWARE
server.use(express.json())


// ENDPOINTS

// [GET]    /             (Hello World endpoint)
server.get('/hello-world', (req, res) => {
    res.status(200).json({message: "hello world"})
})

// [GET]    /api/dogs     (R of CRUD, fetch all dogs)

server.get('/api/dogs', async (req, res) => {

    try {
        const dogs = await Dog.findAll()
        res.status(200).json(dogs)
    }
    catch (err) {
        res.status(500).json({message: `Error fetching All dogs: ${err.message}`})
    }
//using .then instead of try catch
//     // 1- gather info from the request object
//   // 2- interact with db
//   Dog.findAll()
//   .then(dogs => {
//     // 3A- send appropriate response
//     res.status(200).json(dogs)
//   })
//   .catch(error => {
//     // 3B- send appropriate response (sad path)
//     res.status(500).json({ error: error.message })
//   })

})
    

// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get('/api/dogs/:id', async (req, res) => {
    try {
        const {id} = req.params.id;
        const dog = await Dog.findById(id)
        console.log(`the dog:`, dog)
        if(!dog) {
            res.status(404).json({
                message: `No dog with id ${req.params.id}: ${err.message}` })
        } else {
            res.status(200).json(dog)
        }
    } catch (err) {
        res.status(500).json({
            message: `Error fetching dog with id ${req.params.id}: ${err.message}`})
    }

    //alternative methods for the same code
     // 1- gather info from the request object
//   const { id } = req.params
//   // 2- interact with db
//   Dog.findById(id)
//     .then(dog => {
//       // 3A- send appropriate response
//       dog
//         ? res.status(200).json(dog)
//         : res.status(404).json({ message: `no dog with id ${id}` })
//     })
//     .catch(error => {
//       // 3B- send appropriate response (something crashed)
//       res.status(500).json({ error: error.message })
//     })
})
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)

server.post('/api/dogs/', async(req, res) => {

    
    try{
        const {dog} = req.body;
        if(!dog.name || !dog.weight) {
            res.status(422).json({
                message: 'Dogs require a name and a weight',
            })
        } else {
        const createdDog = await Dog.create(req.body)

        res.status(201).json({
            message: 'Success Creating dog',
            data: createdDog,
        })
    }
    } catch (err) {
        res.status(500).json({
            message: `Error creating a new dog: ${err.message}`})
    }

    //  // EXPRESS, BY DEFAULT IS NOT PARSING THE BODY OF THE REQUEST
  // 1- gather info from the request object
//   const dog = req.body

  // crude validation of req.body
//   if (!dog.name || !dog.weight) {
//     res.status(400).json({ message: 'name and weight are required' })
//   } else {
//     try {
//       // 2- interact with db
//       const newlyCreatedDog = await Dog.create(dog)
//       // 3- send appropriate response
//       res.status(201).json(newlyCreatedDog)
//     } catch (error) {
//       res.status(500).json({ error: error.message })
//     }
//   }

})
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)

server.put('/api/dogs/:id', async (req, res) => {
    // 1- pull info from req
    const changes = req.body
    const { id } = req.params
  
    // crude validation of req.body
    if (!changes.name || !changes.weight || changes.adopter_id === undefined) {
      res.status(400).json({ message: 'name, weight and adopter_id are required' })
    } else {
      try {
        // 2- interact with db through helper
        const updatedDog = await Dog.update(id, changes)
        // 3- send appropriate response
        if (updatedDog) {
          res.status(200).json(updatedDog)
        } else {
          res.status(404).json({ message: 'dog not found with id ' + id })
        }
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }
})
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

server.delete('/api/dogs/:id', (req, res) => {
    // 1- gather info from the request object
    const { id } = req.params
    // 2- interact with db
    Dog.delete(id)
      .then(deleted => {
        // 3- send appropriate response
        if (deleted) {
          res.status(200).json(deleted)
        } else {
          res.status(404).json({ message: 'dog not found with id ' + id })
        }
      })
      .catch(error => {
        res.status(500).json({ error: error.message })
      })
  })

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server
const express = require('express')
const mongodbconnection = require('./mongodb');
// const todoconnection = require('./todo');
assert = require('assert')
var  app = express()
const port = 3000
var cors = require('cors')
const bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cors())
// mongodbconnection.mongodbConnection();
app.get('/tasks', mongodbconnection.getTasks)
app.put('/tasks/:id', mongodbconnection.updateTask)
// // app.get('/searchUsers/:name', mongodbconnection.searchUsers)
app.post('/tasks',mongodbconnection.insertTask)

// app.post("/tasks",mongodbconnection.insertUsers);
// app.put('/tasks/:id', mongodbconnection.updateUser)
// app.delete('/tasks', mongodbconnection.removeUser)


// app.get('/todos', todoconnection.getUsers)
// app.get('/todos/:id', todoconnection.getUserDetail)
// // app.get('/searchUsers/:name', todoconnection.searchUsers)
// // app.post('/todos',todoconnection.insertUsers)

// app.post("/todos",todoconnection.insertUsers);
// app.put('/todos/:id', todoconnection.updateUser)
// app.delete('/todos', todoconnection.removeUser)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
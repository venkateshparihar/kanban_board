var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID
var database = "kanban_board";
var clientData;
var url = 'mongodb+srv://venkatesh:venkatesh29@cluster0-5gqdc.mongodb.net/' + database +'?retryWrites=true&w=majority';
    
const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 100, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };

mongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        clientData = client.db(database)
        console.log("Connected successfully to server");
     }
});


exports.getTasks = function (req, res) {
    var collection = clientData.collection('tasks');
    collection.find().toArray(function (err, items) {
    if (!items || !items.length)
        console.log('No records found')
    else
        console.log('Found the ' + items.length + ' records')
        customCallback(items, res)
    })
}

exports.insertTask = function (req, res) {
    
    if (req.body.length <= 0) {
        console.log('No record to insert')
        customCallback('No record to insert', res)
        return
    }
  
    var collection = clientData.collection('tasks')
    collection.insert(req.body, function (err, result) {
        console.log('Inserted  Users', result)
        customCallback(result, res);
    })
}


// exports.getUserDetail = function (req, res) {
//     var collection = clientData.collection('tasks')
//     collection.find({_id: ObjectId(req.params.id)}).toArray(function (err, items) {
//         if (!items || !items.length) {
//             console.log('No records Found')
//             customCallback('No records Found', res)
//             return
//         }
//         console.log('Found ' + items.length + ' record with _id:' + req.param('id'))
//         customCallback(items[0], res)
//     })
// }


exports.updateTask = function (req, res) {
    var collection = clientData.collection('tasks')
    collection.findOneAndUpdate({_id: ObjectId(req.params.id)}, {
        $set: {
                name: req.body.name,
                description:req.body.description,
                archived:req.body.archived,
                lists:req.body.lists
            }
        }, 
        function (err, result) {
            console.log('Updated one record')
            customCallback('Updated one record', res)
        }
    )
}


exports.removeUser = function (req, res) {
    var collection = clientData.collection('tasks');
    collection.remove({_id: ObjectId(req.body.id)}, function (err, result) {
        console.log('Removed one record with _id = "' + req.body.id + '"');
        customCallback('Removed one record', res);
    })
  }
  
var customCallback = function (msg, response) {
    // send json data in response
    response.send(msg)
}
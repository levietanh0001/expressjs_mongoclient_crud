const express = require("express")
const cors = require('cors')
const mongo = require("mongodb").MongoClient



// 1. init app and add middlewares
const app = express()
app.use(express.json())
app.use(cors())


// 2. database
const url = "mongodb://localhost:27017"
let db, trips, expenses
mongo.connect(
    url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db("tripcost")
        trips = db.collection("trips")
        expenses = db.collection("expenses")
    }
)


// 3. crud
app.post("/trip", (req, res) => {
    const name = req.body.name
    trips.insertOne({ 
        name: name 
    }, 
    (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ 
            result: result
        })
    })
})
app.get("/trips", (req, res) => {
    trips.find().toArray((err, items) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ 
            trips: items 
        })
    })
})
app.post("/expense", (req, res) => {
    var data = {
        trip: req.body.trip,
        date: req.body.date,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
    }
    expenses.insertOne(data,
    (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ 
            result: result 
        })
    }
    )
})
app.get("/expenses", (req, res) => {
    expenses.find({ trip: req.body.trip }).toArray((err, items) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ 
            expenses: items 
        })
    })
})
app.put("/expense", (req, res) => {
    var filter = {
        trip: req.query.trip,
        date: req.query.date, 
    }
    var data = { $set: {
        trip: req.body.trip,
        date: req.body.date
    }}
    expenses.updateOne(filter, data, (err, result) => {
        if (err) {
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ 
            result: result,
            trip: req.query.trip,
            date: req.query.date
        })
    })
})
app.delete("/expense", (req, res) => {
    var filter = {
        trip: req.query.trip,
        date: req.query.date, 
    }
    expenses.deleteOne(filter, (err, result) => {
        if (err) {
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ 
            result: result,
            trip: req.query.trip,
            date: req.query.date
        })
    })
})


// 4. run app
app.listen(3000, () => console.log("Server ready"))
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const uri = 'mongodb+srv://Oleks145:1405@cluster0.t4vboa3.mongodb.net/?retryWrites=true&w=majority';

// Connect to the database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB successfully!');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Define a schema for the quotes collection
const quoteSchema = new mongoose.Schema({
  text: {type: String, required: true},
  author: {type: String, required: true}
});

// Create a model for the quotes collection
const Quote = mongoose.model('Quote', quoteSchema);

// This sets up a route that sends the index.html file to the client when they request the root URL.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define an endpoint that returns a random quote from the database
app.get('/api/quotes/random', (req, res) => {
    Quote.countDocuments().exec()
        .then(count => {
            const random = Math.floor(Math.random() * count);
            Quote.findOne().skip(random).exec()
                .then(quote => {
                    res.json({text: quote.text, author: quote.author});
                })
                .catch(err => res.status(500).json({ error: err.message }));
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Define the port to listen on
// const PORT = 3000;

// Start the Express app listening on the defined port
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.")
});





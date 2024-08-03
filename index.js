const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const cors = require('cors');
const roastRouter = require('./routes/roastRouter'); // Import router


const app = express();
const PORT = process.env.PORT || 3001;

// LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST'],
    }
));

app.use(bodyParser.json());
app.use(connectLivereload());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.use('/', roastRouter); // Use the router

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

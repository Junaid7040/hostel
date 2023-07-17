const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(cors());









// BD connections
dotenv.config({ path: './DB/config.env' });
require('./DB/conn');


// For JSON
app.use(express.json());



// Router Connection
app.use(require('./router/auth'))


// PORT NUMBER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('server is runing')
})
const express = require('express');
var cors = require('cors')
const app = express();
const port = 3000;

app.use(cors())

app.get('/hello', (req, res, next) => {
    response = {id:01,msg:'Hello World!'}
    res.json( response );
});

app.get('/test', (req, res, next) => {
    res.send('Test');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
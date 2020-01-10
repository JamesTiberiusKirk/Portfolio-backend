const express = require('express');
var cors = require('cors')
const app = express();
const port = 3000;

cv = {
    author: 'Dumitru Vulpe',
    lastUpdated: '01/01/2020',
    cv_md: '# test \n hello world'
};

app.use(cors());

app.get('/hello', (req, res, next) => {
    response = {id:01,msg:'Hello World!'}
    res.json( response );
});

app.get('/cv', (req, res, next) => {
    res.json( cv );
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const Db = require('./db');
const express = require('express');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors());
var db = new Db('root:example','localhost');

app.get('/hello', (req, res, next) => {
    response = {id:1,msg:'Hello World!'}
    res.json( response );
});

app.get('/cv', (req, res, next) => {
    db.getDb().collection('cv').find({}).toArray((err,documents)=>{
        
        if (err){
            console.log(err);
            return;
        }

        res.json(documents);
    });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
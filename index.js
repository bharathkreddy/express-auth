import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser  from "body-parser";
import morgan from "morgan";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const port = 3000
let isUserAuthorised = false;

// logging middleware
app.use(morgan('combined'));

// BodyParser middleware has to come before custom one because req.body won't be available unless body parser is used.
app.use(bodyParser.urlencoded({ extended: true }));

// Custom middleware; NEXT() is important for the code to progress, else the page will hang and not move forward.
function authorisationCheck(req,res,next){
    if(req.body.password === 'bharath'){
        isUserAuthorised = true;
    };
    next();
}

// use the middleware
app.use(authorisationCheck);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.post('/submit',(req,res)=>{
    if (isUserAuthorised){
        res.sendFile(path.join(__dirname, './public', 'secret.html'));
    } else{
        res.redirect('/');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
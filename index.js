import express from 'express';
import mongoose from 'mongoose';
import User from './src/schemas/users';
import Genre from './src/schemas/genres';
import bodyParser from 'body-parser';
import {createToken} from './src/resolvers/create';
import {verifyToken} from './src/resolvers/verify';

const jsonParser = bodyParser.json();

const app = express();

const port = process.env.Port || 3000 ;

mongoose.connect('mongodb://gabo:gabo2018@ds111492.mlab.com:11492/clone-netflix2018');

const db = mongoose.connection;

db.on('error',() => console.log('Failed to connect to mongoDB'))
    .once('open',()=> console.log('Connected to MongoDB'));


app.listen(port, () => {
    console.log('Server Works on port 3000');
})


app.get('/', (req,res) => {
    res.send("Hello World");
});

app.get('/hola', (req,res) => {
    res.send("Hello hola");
});

app.get('/addUser', (req,res) => {
    var user = new User({
        "name":"TESTO",
        "lastName":"Testing",
        "email": "test@test.com",
        "password": "123456",
        "phone": "66226622"
    });

    user.save((err)=> {
        if(err) throw err
        res.send('Usuario Creado'); 
    })
})

app.get('/addGenre', (req,res) => {
    var genre = new Genre({
        "name":"ACTION",
        "description": "ACTION MOVIES"
    });

    genre.save((err)=> {
        if(err) throw err
        res.send('Genre Creado'); 
    })
})

app.get('/userList', function(req,res){
    User.find({"name":"TESTO"}).then(function(users){
        res.send(users);
    })
})

app.get('/genreList', function(req,res){
    Genre.find({}).then(function(genres){
        res.send(genres);
    })
})


//ENDPOINT DE SIGNUP
app.post('/register', jsonParser, (req,res)=>{
    var user = new User(req.body);

    user.save((err)=>{
        if(err) throw err;
        res.send('Usuario Registrado');
    })
})

//ENDPOINT DE LOGIN
app.use('/login',jsonParser,(req,res)=>{
    if(req.method === 'POST'){
        const token = createToken(req.body.email, req.body.password).then((token)=>{
            res.status(200).json({token});
        })
        .catch((err)=>{
            res.status(403).json({
                message: 'Login failed, INVALID CREDENTIALS'
            })
        })
    }
})



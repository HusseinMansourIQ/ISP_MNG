const express = require("express")
const app = express()
const db = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
// bring ejs template

app.set('view engine', 'ejs')
// bring body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//bring static

app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('node_modules'))
// session and flash config .
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app.use(flash())
// bring passport 
app.use(passport.initialize())
app.use(passport.session())
//store user object 

app.get('*', (req,res,next)=> {
    res.locals.user = req.user || null
    next()
})

app.get('/', (req,res)=> {

   res.redirect('/events')
    
})

// bring events routes

const events = require('./routes/event-routes')
app.use('/events', events)

// bring user routes
const users = require('./routes/user-routes')
app.use('/users', users)
// have fun games route
const hv = require('./routes/hv-routes')
app.use('/hv', hv)
// listen to port 3000

app.listen(3000, ()=> {

    console.log(' app is wokring on port 3000')
})


//
//
//backup for mongo db
//
//

/*
const { spawn } = require('child_process');
const path = require('path');
const cron = require('cron');

const DB_NAME = 'amcDB';
const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`);

backupMongoDB()
function backupMongoDB() {
    const child = spawn('mongodump', [
        `--db=${DB_NAME}`,
        `--archive=${ARCHIVE_PATH}`,
        '--gzip',
    ]);

    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
    });
    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
    });
    child.on('error', (error) => {
        console.log('error:\n', error);
    });
    child.on('exit', (code, signal) => {
        if (code) console.log('Process exit with code:', code);
        else if (signal) console.log('Process killed with signal:', signal);
        else console.log('Backup is successfull ✅');
    });
}
*/
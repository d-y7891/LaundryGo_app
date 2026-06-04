require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const path = require('path')
const app = express()
const expressLayout = require('express-ejs-layouts')
const initRoutes = require('./routes/web.js')
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require("express-flash")
const MongoStore = require('connect-mongo');
const passport = require('passport')
const Emitter = require('events')

mongoose.connect(process.env.MONGO_CONNECTION_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});
const connection = mongoose.connection;
connection.once('open', () => { console.log('Database Connected'); });
connection.on('error', (err) => { console.error('Connection Failed:', err); });

let mongoStore = new MongoStore({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    collection: 'sessions'
})

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}
}))
app.use(flash())

const passportInit = require('./app/config/passport.js')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

initRoutes(app);

app.use((req, res) => {
    res.status(404).render('errors/404')
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const { Server } = require('socket.io')
const io = new Server(server)

io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        socket.join(roomId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
eventEmitter.on('orderPlaced', (data) => {
    io.to(`provider_${data.providerId}`).emit('orderPlaced', data)
})

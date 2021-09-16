require('dotenv').config()
const express = require('express')
var { Liquid } = require('liquidjs');
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { ExpressPeerServer } = require('peer');
const { homeRouter, loginRouter, logoutRouter, postAPI, postsRouter, registrationRouter, profileRouter, searchRouter, searchAPI, messageRouter, notificationRouter, chatAPI, messageAPI, notificationAPI, hashtagRouter, hashtagAPI, callRoomRouter } = require('./routes/index')
const { checkIsLoggedIn, isRememberedCookiePresent, generateUserJWT, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags } = require('./middleware')
const { connect } = require('./socket')

const app = express()
const port = process.env.PORT || 3000;
const db = require('./db/index')
const server = app.listen(port, () => console.log("Server listening on port " + port))
connect(server);

const peerServer = ExpressPeerServer(server, {
  path: '/peer-server',
  port: process.env.PORT || 3000
});
app.use('/peerjs', peerServer);

const viewsPath = path.join(__dirname, "./templates/views")

console.log(`Is in production ${process.env.NODE_ENV === 'production'}`)
var engine = new Liquid({
  cache: process.env.NODE_ENV === 'production',
  extname: '.liquid',
  // root: [viewsPath, partialsPath]
});
app.engine('liquid', engine.express());

app.set('view engine', 'liquid');
app.set('views', viewsPath)

app.use(cookieParser(process.env.SECRET_KEY));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: false
}));

app.use(helmet({
  contentSecurityPolicy: false
}))
//* Referrer-Policy - ja sam definisao no refferer kao vrednost jer ne zelim da se prosledjuje do drugog sajta url adresa mog sajta i info o tome da je user dosao sa mog sajta na njegov

//* Strict-Transport-Security - govori browseru da prefer-uje je https over http, i koliko dugo da pamti https konekcije

//* X-Content-Type-Options - default je no sniff. Ovaj Header govori browseru da ne treba da nagadja mime type resursa koji je stigao sa servera, vec da striktno koristi ono sto ce se poslati u content-type. Ako ovo postavim, i recimo za html stranicu na serveru kazem da ima content-type text, ona se nece renderovati kako treba iako je .html fajl.

//* X-DNS-Prefetch-Control - response header koji kontrolise DNS prefetching. Ovaj feature omogucava browseru da razresava sve url adrese u ip adrese koje user moze da klikne dok je on na stranici, ovo omogucava korisniku da brze stigne do neke stranice! Ukoliko ovo iskljucim kao sto sam ja kod mene iskljucio onda sam se zastitio od toga da neko pogresno i zlonamerno promeni neku url adresu u ip adresu, naravno po cenu brzine jer ce tek kada se klikne na link razresiti url.

//* X-Frame-Options - response header kojim se iframe moze ucitati samo sa odredjenih sajtova. 

//* X-Powered-By - sklanja ovaj response header koji govori koji server je u pozadini. Ovo nema nikakvih security benefita, jer svakako onaj ko zeli moze da sazna koji je server u pozadini, vec jednostavno sklanja header koji nije bitan.

//* X-XSS-Protection - 

app.use('/api/posts', checkIsLoggedIn, postAPI);
app.use('/api/chat', checkIsLoggedIn, chatAPI);
app.use('/api/search', checkIsLoggedIn, searchAPI);
app.use('/api/message', messageAPI);
app.use('/api/notification', checkIsLoggedIn, notificationAPI);
app.use('/api/topics', checkIsLoggedIn, hashtagAPI);

app.use(express.static(path.join(__dirname, './dist/')))
app.use('*/uploads/images', express.static(path.join(__dirname, 'uploads/images')))

app.use('/login', isRememberedCookiePresent, loginRouter);
app.use('/logout', logoutRouter);
app.use('/registration', registrationRouter);
app.use('/post', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, postsRouter);
app.use('/profile', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, profileRouter);
app.use('/search', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, searchRouter);
app.use('/messages', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, messageRouter);
app.use('/topic', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, hashtagRouter);
app.use('/notifications', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, notificationRouter);
app.use('/call_room', checkIsLoggedIn, generateUserJWT, callRoomRouter);
app.use('/', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, getMostPopularHashtags, generateUserJWT, homeRouter);


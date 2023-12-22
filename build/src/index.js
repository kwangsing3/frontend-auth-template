"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_handlebars_1 = require("express-handlebars");
const session = require("express-session");
const app = express();
const PORT = 3000;
const auth = (req, res, next) => {
    if (req.session.user) {
        console.log('authenticated');
    }
    else {
        console.log('not authenticated');
        return res.redirect('/');
    }
    return next();
};
//template engine
app.engine('handlebars', (0, express_handlebars_1.engine)({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', './views');
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'mySecretWord',
    name: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 5 }, //5 minutes
}));
//
//
app.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    if (req.session.user) {
        return res.redirect('/welcome');
    }
    res.render('index');
});
app.get('/welcome', auth, (req, res) => {
    const userName = req.session.id;
    return res.render('welcome', { message: `Welcome back, ${userName}!` });
});
app.listen(PORT, () => console.log(`Listening to server on port: ${PORT}`));
//# sourceMappingURL=index.js.map
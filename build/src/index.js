"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const session = require("express-session");
const app = (0, express_1.default)();
const PORT = 3000;
const users = [
    {
        firstName: 'Tony',
        email: 'tony@stark.com',
        password: 'iamironman',
    },
    {
        firstName: 'Steve',
        email: 'captain@hotmail.com',
        password: 'icandothisallday',
    },
    {
        firstName: 'Peter',
        email: 'peter@parker.com',
        password: 'enajyram',
    },
    {
        firstName: 'Natasha',
        email: 'a@a',
        password: 'a',
    },
    {
        firstName: 'Nick',
        email: 'nick@shield.com',
        password: 'password',
    },
];
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
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(session({
    secret: 'mySecretWord',
    name: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 5 }, //5 minutes
}));
app.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    if (req.session.user) {
        return res.redirect('/welcome');
    }
    res.render('login');
});
app.get('/welcome', auth, (req, res) => {
    const userName = req.session.id;
    return res.render('welcome', { message: `Welcome back, ${userName}!` });
});
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/welcome');
    }
    return res.render('login');
});
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/welcome');
    }
    return res.render('register');
});
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    users.push({
        firstName: '1',
        email: email,
        password: password,
    });
    return res.render('register', { alert: '註冊成功' });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (email.trim() === '' || password.trim() === '') {
        return res.render('login', {
            alert: 'Password or email is incorrect, please try again!',
        });
    }
    for (const user of users) {
        if (user.email === email && user.password === password) {
            req.session.user = user.firstName;
            return res.redirect('/welcome');
        }
    }
    return res.render('login', {
        alert: 'Password or email is incorrect, please try again!',
    });
});
app.get('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        console.log('session destroyed');
    });
    res.render('login', {
        alert: 'You are logged out! Re-enter email and password to log in again!',
    });
});
app.listen(PORT, () => console.log(`Listening to server on port: ${PORT}`));
//# sourceMappingURL=index.js.map
import express from 'express';
import {engine} from 'express-handlebars';
import session = require('express-session');

const app = express();
const PORT = 3000;

const users: {firstName: string; email: string; password: string}[] = [
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
//額外宣告
declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

const auth = (req: express.Request, res: express.Response, next: Function) => {
  if (req.session.user) {
    console.log('authenticated');
  } else {
    console.log('not authenticated');
    return res.redirect('/');
  }
  return next();
};

//template engine
app.engine('handlebars', engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(
  session({
    secret: 'mySecretWord',
    name: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 5}, //5 minutes
  })
);

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
  return res.render('welcome', {message: `Welcome back, ${userName}!`});
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
  const {email, password} = req.body;
  users.push({
    firstName: '1',
    email: email,
    password: password,
  });
  return res.render('register', {alert: '註冊成功'});
});
app.post('/login', (req, res) => {
  const {email, password} = req.body;
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

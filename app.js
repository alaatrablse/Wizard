var express = require('express');
var mongoose = require('mongoose');

var userRouter = require('./routes/user');
var wizardRouter = require('./routes/wizard');
var pageRouter = require('./routes/page');
var wizardDataRouter = require('./routes/wizardData');
var answerRouter = require('./routes/answer');

var app = express();

var port = '1337';
app.listen(port, () => {
    console.log("server listening on port : " + port);
    mongoose.connect('mongodb://127.0.0.1:27017/api')
        .then(_ => {
            console.log('connected to db !!!');
            // Check if the user already exists
            const User = require('./models/user');
            User.findOne({ email: 'admin@gmail.com' })
                .then(existingUser => {
                    if (existingUser) {
                        console.log('User already exists!');
                    } else {
                        // Add a new user here
                        const user = new User({
                            name: 'admin',
                            email: 'admin@gmail.com',
                            password:'123456',
                            type:'ADMIN'
                        });
                        user.save()
                            .then(_ => {
                                console.log('New user added successfully!');
                            })
                            .catch(e => {
                                console.log('Error adding user:', e);
                            });
                    }
                })
                .catch(e => {
                    console.log('Error finding user:', e);
                });
        })
        .catch(e => {
            console.log('connection error ', e);
        })
});

app.use(express.static('StaticFile'));

app.use(express.json());

app.use('/users', userRouter);
app.use('/wizards', wizardRouter);
app.use('/pages', pageRouter);
app.use('/wizardData', wizardDataRouter);
app.use('/Answer', answerRouter);

app.use((req, res, next) => {
    let err = new Error('please I check endPoint and try again');
    err.status = 404;
    next(err);
});

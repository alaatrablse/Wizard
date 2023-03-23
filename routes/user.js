var router = require('express').Router();
var user = require('../models/user');
var wizard = require('../models/wizard');

router.route('/')
    .get( async (req, res, next) => {
        try {
            let data = await user.find(req.query);
            const modifiedData = data.map(d => ({id: d._id,...d.toObject(), wizards:[],password:'', _id: undefined }));
            res.json( modifiedData );


        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
          const { email } = req.body;
          const existingUser = await user.findOne({ email });
          if (existingUser) {
            // If the email already exists in the database, send a response indicating that the email is not available
            res.status(409).json({ message: 'Email already in use' });
          } else {
            // If the email is not already in the database, create a new user and save it
            let newData = new user(req.body);
            let saved = await newData.save();
            res.json(saved);
          }
        } catch (error) {
          next(error);
        }
      });

    router.route('/:email/:password')
    .get(async (req, res, next) =>{
        try{
            let { email, password } = req.params;
            email = email.toLowerCase(); // Convert email to lowercase
            const existingUser = await user.findOne({ email, password });

            if (!existingUser) {
                res.status(404).json({ message: 'User not found' });
            } else {
                const modifiedData = {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    password: existingUser.password,
                    type: existingUser.type,
                    createdAt: existingUser.createdAt,
                    updatedAt: existingUser.updatedAt,
                };
                res.json(modifiedData);
            }
        } catch (error) {
            next(error);
        }
    });

    router.route('/:id')
    .get(async (req, res, next) => {
        try {
            const existingUser = await user.findById(req.params.id);
            const existingwizard = await wizard.find({userId:req.params.id});

            if (!existingUser) {
                res.status(404).json({ message: 'User not found' });
            } else {
                const myMap = new Map();
                for (let i = 0; i < existingwizard.length; i++) {
                    myMap.set(existingwizard[i].hashnum, existingwizard[i].titel);
                }
                res.json(Array.from(myMap));
            }
        } catch (error) {
            next(error);
        }
    })
    .put(async (req, res, next) => {
        try {
            let olddata = await user.findById(req.params.id);
            console.log(olddata)
            req.body.password=olddata.password
            let data = await user.findByIdAndUpdate(req.params.id,req.body,{ new:true });
            
            if (!data) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(data);
        } catch (error) {
            next(error);
        }
    })
    .delete(async (req, res, next) =>{
        try {
            let deletedData = await user.findByIdAndRemove(req.params.id);
            if(deletedData != null){
                let wizardlis = await wizard.find({userId:req.params.id});
                for(wizardelement of wizardlis){
                    await wizard.findOneAndRemove({userId:req.params.id})
                }
            }
            res.json(deletedData)
        } catch (error) {
            next (error);
        }
    });

    router.get('/count', async (req, res, next) => {
        try {
            let count = await user.countDocuments(req.query);
            res.json({count});

        } catch (error) {
            next(error);
        }
    })


module.exports = router;

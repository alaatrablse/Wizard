var router = require('express').Router();
var answer = require('../models/answer');

router.route('/')
    .get( async (req, res, next) => {
        try {
            let data = await answer.find(req.query);
           
            res.json( data );


        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
            const lis = []
            for(a of req.body){
                let newData = new answer(a);
                let saved = await newData.save();
                lis.push(saved)
            }
            
            res.json(lis);
          
        } catch (error) {
          next(error);
        }
      });


router.route('/:id')
    .get( async (req, res, next) => {
        try {
            const data = await answer.find({WizardDatumId:req.params.id});
            
            res.json( data );


        } catch (error) {
            next(error);
        }
    })


module.exports = router;

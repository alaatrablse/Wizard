var router = require('express').Router();
const wizardData = require('../models/wizardData');

router.route('/')
    .get( async (req, res, next) => {
        try {
            let data = await wizardData.find(req.query);
            if(data == null){
                res.status(404).json({ message: 'wizardData is empty' });
            }else{
                res.json( data );
            }
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
        
            let newData = new wizardData(req.body);
            let saved = await newData.save();
            res.json(saved);
          
        } catch (error) {
          next(error);
        }
      });

module.exports = router;

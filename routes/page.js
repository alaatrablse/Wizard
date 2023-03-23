var router = require('express').Router();
var page = require('../models/page');

router.route('/')
    .get( async (req, res, next) => {
        try {
            let data = await page.find(req.query);
           
            res.json( data );


        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
        
            let newData = new page(req.body);
            let saved = await newData.save();
            res.json(saved);
          
        } catch (error) {
          next(error);
        }
      });

module.exports = router;

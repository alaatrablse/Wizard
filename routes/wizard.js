var router = require('express').Router();
var wizard = require('../models/wizard');
var page = require('../models/page');
var wizardData = require('../models/wizardData');

router.route('/')
    .get( async (req, res, next) => {
        try {
            let data = await wizard.find(req.query);
            //const modifiedData = data.map(d => ({id: d._id,...d.toObject(), wizards:[], _id: undefined }));
            res.json( data );


        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
            const newData = new wizard(req.body);
            const pages = req.body.pages || [];

            if (!newData) {
                return res.status(400).json({ message: 'Bad Request' });
            } 
    
            const { hashnum } = newData;
    
            if (hashnum === 0) {
                const randomNumber = Math.floor(Math.random() * 49000) + 1000;
    
                while (await wizard.findOne({ hashnum: randomNumber })) {
                    randomNumber = Math.floor(Math.random() * 49000) + 1000;
                }
                
                newData.hashnum = randomNumber;
                const savedWizard = await saveWizard(newData);
                const savedPages = await savePages(savedWizard._id, pages);
                const savedWizardData = await saveWizardData(savedPages,pages);
                  
                res.json({ wizard: savedWizard, pages: savedPages, wizardData: savedWizardData });
            } else if (await wizard.findOne({ hashnum })) {
                let updete = await updateWizard(req.body)
                res.json(updete)
            } else {
                res.status(404).send('Not found');
            }
        } catch (error) {
            next(error);
        }
    });
      
async function saveWizard(newData) {
    const savedWizard = await newData.save();
    return savedWizard;
}

async function savePages(wizardId, pages) {
    const savedPages = [];
    for (const pageData of pages) {
        const newPage = new page({ 
            wizardType: pageData.wizardType, 
            numPages: pageData.numPages, 
            wizardid: wizardId 
        });
    
        const savedPage = await newPage.save();
        savedPages.push(savedPage);
    }

    return savedPages;
}
    
async function saveWizardData(savedPages,pages) {
    const savedWizardData = [];
    for (let i =0; i<savedPages.length;i++) {
        for (const wizardDataData of pages[i].wizardData) {
            const newWizardData = new wizardData({ 
                wizardIndex: wizardDataData.wizardIndex,
                pageId: savedPages[i]._id
            });

            const savedWizardDataObject = await newWizardData.save();
            savedWizardData.push(savedWizardDataObject);
        }
    }

    return savedWizardData;
}
    
async function updateWizard(body) {
    const a = {
        titel: body.titel,
        description : body.description,
        userId: body.userId,
        hashnum: body.hashnum
    }
    let updete = await wizard.findOneAndUpdate(body.id,a,{new:true})
    console.log(updete)
    if(updete){
        let find = await page.find({ wizardid: updete._id })
        await page.deleteMany({ wizardid: updete._id })
        for(wd of find){
            await wizardData.deleteMany({ pageId: wd._id })
        }

        for(ypage of body.pages){
            const b ={
                wizardType:ypage.wizardType,
                numPages:ypage.numPages,
                wizardid:body.id
            }
            let newPage = new page(b)
            let savedPages = await newPage.save();
            
            for(datawizard of ypage.wizardData){
                const c = {
                    wizardIndex:datawizard.wizardIndex,
                    pageId: savedPages._id
                }
                let newPage1 = new wizardData(c)
                await newPage1.save();
            }
        }
    }
    return body;
}
    

router.route('/:hashnum')
    .get(async (req, res, next) =>{
        try{
            const existingwizard = await wizard.findOne({ hashnum: req.params.hashnum });
            const s = await getwizards(existingwizard)
            if (!existingwizard) {
                res.status(404).json({ message: 'Wizard not found' });
            } else {
                
                res.json(s);
            }
        } catch (error) {
            next(error);
        }
    });

async function getwizards(wizard){
    if (!wizard) {
        return null;
    }
    const existingpages = await page.find({ wizardid: wizard._id });
    const pages = [];
    
    for (const page of existingpages) {
        const existingwizarddata = await wizardData.find({ pageId: page._id });
        const a ={ 
            "id": page._id,
            "wizardType": page.wizardType,
            "numPages": page.numPages,
            "wizardId": wizard._id,
            "wizardData":[]
        }
        for (const wizarddata of existingwizarddata){
            a.wizardData.push({
                "id": wizarddata._id,
                "wizardIndex": wizarddata.wizardIndex,
                "pageId": page._id
            })
        }
        pages.push(a);
    }
    
    const s = {
        "id": wizard._id,
        "titel":wizard.titel,
        "description": wizard.description,
        "userId": wizard.userId,
        "hashnum": wizard.hashnum,
        "pages": pages
    }
    return s;
}

router.route('/:hashnum/:userId')
.delete(async (req, res, next) =>{
    try{
        const existingwizard = await wizard.findOneAndDelete({ hashnum: req.params.hashnum, userId: req.params.userId });
        let pagedata = await page.find({wizardid: existingwizard._id });
        for(p of pagedata ){
            let element = await page.findByIdAndRemove(p._id);
            await wizardData.deleteMany({ pageId:element._id})
        }
        
        if (!existingwizard) {
            res.status(404).json({ message: 'Wizard not found' });
        } else {
            res.json(existingwizard);
        }
    } catch (error) {
        next(error);
    }
});

    
module.exports = router;

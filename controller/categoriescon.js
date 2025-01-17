const Category=require('../models/categoriesmod');


exports.getCategories = (req , res, next) => {
    res.status(200).send({
        success:true, 
        data: 'buh categoriudiin medeelel',
        user: req.userID,
    });
};

exports.getCategory = (req , res, next) => {
    res.status(200).send({
        success:true, 
        data: `${req.params.catid} Id tei categoriig medeellig avna`,
    });
};

exports.createCategory = async (req , res, next) => {
    console.log('data: ', req.body);
    
    try{
        const category=await Category.create(req.body);

        res.status(200).send({
            success:true, 
            data: category,
        });
    }catch(err){
        res.status(400).send({
            success:false, 
            error: err,
        });
    }

};

exports.updateCategory = (req , res, next) => {
    res.status(200).send({
        success:true, 
        data: `${req.params.catid} Id tei categori uurchluh`
    });
};

exports.deleteCategory = (req , res, next) => {
    res.status(200).send({
        success:true, 
        data: `${req.params.catid} Id tei categoriig ustgana`
    });
};
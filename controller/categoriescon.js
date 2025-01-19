const Category=require('../models/categoriesmod');


exports.getCategories = async (req , res, next) => {
    try{
        const categories = await Category.find();
        res.status(200).send({
        success:true, 
        data: categories,
    });
    } catch (err){
        next(err); 
    }
};

exports.getCategory = async (req , res, next) => {
    try {
        const category = await Category.findById(req.params.catid);
        if (category === null){
            res.status(400).send({
                success:false, 
                error: "Sorry this category doesn't exist",
            }); 
        }
        res.status(200).send({
            success:true, 
            data: category,
        });
    }catch(err){
        next(err);      
    }

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
        next(err); 
    }

};

exports.updateCategory = async (req , res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.catid, req.body, {
            new: true,
            runValidators: true
        });
        if (category === null){
            res.status(400).send({
                success:false, 
                error: "Sorry this category doesn't exist",
            }); 
        }
        res.status(200).send({
            success:true, 
            data: category,
        });
    }catch(err){
        next(err);         
    }

};

exports.deleteCategory = async (req , res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.catid);
        if (category === null){
            res.status(400).send({
                success:false, 
                error: "Sorry this category doesn't exist",
            }); 
        }
        res.status(200).send({
            success:true, 
            data: category,
        });
    }catch(err){
        next(err);      
    }

};
//custom middleware

const logger = (req,res,next) => {
    req.userID = "buka";
    console.log(`${req.method} ${req.protocol}:// ${req.host} ${req.originalUrl}`);
    next();
};

module.exports = logger;

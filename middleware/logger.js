//custom middleware

const logger = (req,res,next) => {
    req.userID = "buka";
    console.log(`${req.method} ${req.protocol}://  ${req.originalUrl}`);
    next();
};

module.exports = logger;

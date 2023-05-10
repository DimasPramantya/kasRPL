const errorHandler = (err,req,res,next)=>{
    res.status(500).json({"err": err.message})
}

module.exports = errorHandler;
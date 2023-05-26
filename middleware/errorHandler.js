const errorHandler = (err,req,res,next)=>{
    res.status(200).json({status: "error",err: err.message})
}

module.exports = errorHandler;
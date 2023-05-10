const notFoundHandler = (req,res,next)=>{
    res.status(404).json({status: "Resource Not Found!!!"})
}

module.exports = notFoundHandler;
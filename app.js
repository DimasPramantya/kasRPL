const express = require('express');

const association = require('./utils/association');

const app = express();

association()
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    })
})


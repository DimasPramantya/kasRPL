const express = require('express');

const association = require('./utils/assoc & seed');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/404');
const memberRoutes = require('./routes/member')
const adminRoutes = require('./routes/admin')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);

app.use(memberRoutes)

app.use(errorHandler);

app.use(notFoundHandler);

association()
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    })
})


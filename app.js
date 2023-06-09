const express = require('express');
const multer = require('multer');
const cors = require('cors');

const association = require('./utils/assoc & seed');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/404');
const memberRoutes = require('./routes/member')
const adminRoutes = require('./routes/admin');
const upload = require('./middleware/multer');

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT']
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(upload.single('image'));

app.use("/admin", adminRoutes);

app.use(memberRoutes)

app.use(errorHandler);

app.use(notFoundHandler);

association()
.then(()=>{
    app.listen(5000,()=>{
        console.log('server is running on port 5000');
    })
})


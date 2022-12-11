const bodyParser = require("body-parser");
const express = require('express')
const dbConnect = require('./config/dbConnect')
const app = express()
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/authRoutes')
const postRouter = require('./routes/postRoutes')
const {notFound, errorHandler} = require("./middlewares/errorHandler");
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const slugify = require('slugify')
dbConnect()

app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())

app.use('/api/user', authRouter);
app.use('/api/post', postRouter);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})
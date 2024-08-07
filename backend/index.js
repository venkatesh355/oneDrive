const express = require('express')
const app = express()
const {fileUploads} = require('./controller/file')
const OneDrive = require('./routes/fileUpload.routes')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())


// app.use(OneDrive)
// const uploadRouter = require('./routes/upload');
app.use('/', OneDrive);

app.post('/', fileUploads)

const PORT = 5000
app.listen(PORT, ()=>{
    console.log(`server started on port:${PORT}`)
})
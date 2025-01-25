const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const {app}=require('./app');

const mongoose=require('mongoose');

process.on('uncaughtException', (err)=>{
    console.error(err.stack);
});

const DB=process.env.DATABASE.replace(
    '<db_password>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB,
).then(()=>{
    console.log('Connected to DB');
});

const port = process.env.PORT || 3001;

const server=app.listen(port,()=>{
    console.log(`Server started on port: ${port}`);
});
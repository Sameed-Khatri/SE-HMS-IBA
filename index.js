const express = require('express');
const app = express();
const connection=require('./database');
const userRoutes=require('./login');
const adminRoutes=require('./admin');
const patientRoutes=require('./patient');
const doctorRoutes=require('./doctor');
const cors = require('cors');


app.set('port', 3001);

app.use(express.json());
app.use(cors());

app.use(async(req,res,next) => {
    try {
        req.db=await connection();
        next();
    } catch (error) {
        console.error('Error establishing database connection:', error);
        res.status(500).json({ status: 'Internal server error' });
    }
});

app.get('/MartinDow', async(req,res) =>{
    try {
        res.sendFile(__dirname+'/login.html')
    } catch (error) {
        console.error('Error in /some-route:', error);
        res.status(500).json({ status: 'Internal server error' });
    }
});

app.use('/user', userRoutes);
app.use('/admin',adminRoutes);
app.use('/patient',patientRoutes);
app.use('/doctor',doctorRoutes);


app.listen(app.get('port'), () => {
    const serverURL = `http://localhost:${app.get('port')}`; 
    console.log(serverURL);
    console.log('Server on port', app.get('port'));
});
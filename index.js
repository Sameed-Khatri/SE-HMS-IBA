const express = require('express');
const app = express();
const connection=require('./database');
const userRoutes=require('./login');
const adminRoutes=require('./admin');
const cors = require('cors');
// const userReportRoutes=require('./routes/user report');
// const adminReportRoutes=require('./routes/admin');
// const actionReportRoutes=require('./routes/actionTeam');

app.set('port', 3001);

// Middlewares
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
// Routes
app.use('/user', userRoutes);
app.use('/admin',adminRoutes);
// app.use('/userReport', userReportRoutes);
// app.use('/admin', adminReportRoutes);
// app.use('/actionTeam', actionReportRoutes);

// Starting the server
app.listen(app.get('port'), () => {
    const serverURL = `http://localhost:${app.get('port')}`; 
    console.log(serverURL);
    console.log('Server on port', app.get('port'));
});
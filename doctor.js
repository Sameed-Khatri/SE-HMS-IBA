const { Router } = require('express');
const router = Router();
const { route } = require('express/lib/application');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/fetchUpcomingAppointments/:doctorID', async(req, res) => {
    try {
        const con = req.db;
        const doctorID = req.params.doctorID;
        const appointment_status = 'Scheduled';
        const binds = [doctorID,appointment_status];
        const sql='select appointment_id,date_time,p.full_name as patient_name,appointment_status,appointment_type,appointment_mode from appointments join patients p using(patient_id) where doctor_id=:1 and appointment_status=:2';
        const result = await con.execute(sql, binds);
        if(result.rows.length===0) {
            console.log('no upcoming appointments');
            res.status(200).json({status:'no upcoming appointments'});
        }else{
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in fetching upcoming appointmnets doctor', error);
        res.status(500).json({ status: 'Internal server error in catch block fetch upcoming appointmnets doctor' });
    }
});

router.get('/allAppointments/:doctorID',async(req,res)=>{
    try {
        const con=req.db;
        const doctorID=req.params.doctorID;
        const binds=[doctorID];
        const sql="select appointment_id,p.full_name as patient_name,date_time,appointment_mode,appointment_status,appointment_type from appointments join patients p using (patient_id) where doctor_id=:1";
        const result=await con.execute(sql,binds);
        console.log(result);
        if(result.rows.length===0){
            console.log('no appointments made');
            res.status(200).json({status:'no appointments made'});
        }else{
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in fetching all apointments doctor', error);
        res.status(500).json({ status: 'Internal server error in catch all appointments doctor' });
    }
});

router.get('/searchAppointments/:doctorID',async(req, res) => {
    try {
        const con=req.db;
        const doctorID=req.params.doctorID;
        const mode=req.query.mode;
        const status=req.query.status;
        const type=req.query.type;
        const binds=[doctorID];
        let sql="select appointment_id,patient_id,p.full_name as patient_name,date_time,appointment_mode,appointment_status,appointment_type from appointments join patients p using (patient_id) where doctor_id=:1 and 1=1 ";
        if(mode){
            binds.push(mode);
            sql+=" and appointment_mode=:2";
        }
        if(status){
            binds.push(status);
            sql+=" and appointment_status=:3";
        }
        if(type){
            binds.push(type);
            sql+=" and appointment_type=:4";
        }
        const result=await con.execute(sql,binds);
        console.log(result);
        if(result.rows.length===0){
            console.log('no appointments found');
            res.status(200).json({status:'no appointments found'});
        }else{
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in searching apointments doctor', error);
        res.status(500).json({ status: 'Internal server error in catch search appointments doctor' });
    }
});

module.exports=router;
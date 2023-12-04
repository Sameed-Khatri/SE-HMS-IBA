const { Router } = require('express');
const router = Router();
const { route } = require('express/lib/application');
const bodyParser = require('body-parser');

router.use(bodyParser.json());


router.get('/fetchUpcomingAppointments/:patientID', async(req, res) => {
    try {
        const con = req.db;
        const patientID = req.params.patientID;
        console.log(patientID);
        const appointment_status = 'Scheduled';
        const binds = [patientID,appointment_status];
        const sql='select appointment_id,date_time,d.full_name as doctor_name,appointment_status from appointments join doctors d using(doctor_id) where patient_id=:1 and appointment_status=:2';
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
        console.error('Error in fetching upcoming appointmnets patient', error);
        res.status(500).json({ status: 'Internal server error in catch block fetch upcoming appointmnets patient' });
    }
});

router.get('/fetchPrescriptions/:patientID', async(req, res) => {
    try {
        const con = req.db;
        const patientID = req.params.patientID;
        const binds = [patientID];
        const sql='select prescription_id,d.full_name as doctor_name,date_of_prescription from prescriptions join doctors d using(doctor_id) where patient_id=:1 order by date_of_prescription desc';
        const result = await con.execute(sql,binds);
        if(result.rows.length===0) {
            console.log('no presriptions found');
            res.status(200).json({status:'no presriptions found'});
        }else{
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in fetching prescriptions', error);
        res.status(500).json({ status: 'Internal server error in catch block fetch prescription' });
    }
});


//not adding veiw prescriptions for patient
//add book an appointment feature api ( it requires a searching feature)


module.exports=router;
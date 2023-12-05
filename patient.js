const { Router } = require('express');
const router = Router();
const { route } = require('express/lib/application');
const bodyParser = require('body-parser');
const mapDayToDBFormat=require('./conversionDays');

router.use(bodyParser.json());


router.get('/fetchUpcomingAppointments/:patientID', async(req, res) => {
    try {
        const con = req.db;
        const patientID = req.params.patientID;
        console.log(patientID);
        const appointment_status = 'Scheduled';
        const binds = [patientID,appointment_status];
        const sql='select appointment_id,appointment_date,time_slot,d.full_name as doctor_name,appointment_status from appointments join doctors d using(doctor_id) where patient_id=:1 and appointment_status=:2';
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


router.get('/searchDoctors',async(req,res)=>{
    try {
        const con=req.db;
        const departmentName=req.query.department;
        const date=req.query.date;
        const abbreviatedDays=mapDayToDBFormat(date);
        const appointmentMode=req.query.appointmentMode;
        const timeSlot=req.query.time;
        const binds=[departmentName,appointmentMode,abbreviatedDays,timeSlot];
        const sql='select d.full_name as doctor_name from doctor_schedule join doctors d using (doctor_id) join departments using (department_id) where upper(department_name)=upper(:1) and upper(mode_of_availability)=upper(:2) and day=:3 and time_slot=:4';
        const result=await con.execute(sql,binds);
        console.log(result);
        if (result.error) {
            console.error('Error searching doctors ', result.error);
            res.status(500).json({ status: 'Internal server error in catch block seach doctors' });
        } else {
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in searching doctors', error);
        res.status(500).json({ status: 'Internal server error in catch block seach doctors' });
    }
});

router.post('/bookAppointment/:patientID', async (req, res)=>{
    try {
        const con = req.db;
        const pateintID=req.params.patientID;
        const departmentName = req.body.department;
        const date = req.body.date;
        const appointmentMode = req.body.appointmentMode;
        const appointmentType = req.body.appointmentType;
        const doctorName = req.body.doctorName;
        const timeSlot = req.body.time;
        const formattedDOB = `TO_DATE('${date}', 'YYYY-MM-DD')`;

        const binds1 = [doctorName];
        const sql1="select doctor_id from doctors where doctor_id=:1"
        const result1=await con.execute(sql1,binds1);
        if(result1.error){
            console.error('Error fetching doctor id ', result1.error);
            res.status(500).json({ status: 'Internal server error in fetching doctor id' });
        }else{
            const rows=result1[0];
            const doctorID=rows[0];
            const binds2=[departmentName];
            const sql2="select department_id from departments where department_name=:1";
            const result2=await con.execute(sql2,binds2);
            if(result2.error){
                console.error('Error fetching depatment id ', result2.error);
                res.status(500).json({ status: 'Internal server error in fetching department id' });
            }else{
                const rows2=result2[0];
                const departmentID=rows2[0];
                const binds3=[doctorID,pateintID,departmentID,formattedDOB,appointmentMode,appointmentType,timeSlot];
                const sql3="insert into appointments (doctor_id,patient_id,department_id,appointment_date,appointment_mode,appointment_type,time_slot) values (:1,:2,:3,:4,:5,:6,:7)"
                const result3=await con.execute(sql3,binds3);
                if(result3.error){
                    console.error('Error in booking appointment ', result3.error);
                    res.status(500).json({ status: 'Internal server error in booking appointment' });
                }else{
                    res.status(200).json({status:'appointment booked successfully'});
                }
            }
        }
    } catch (error) {
        console.error('Error in booking appointment', error);
        res.status(500).json({ status: 'Internal server error in catch block booking appointment' });
    }
});

module.exports=router;
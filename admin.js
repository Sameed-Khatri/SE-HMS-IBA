const { Router } = require('express');
const router = Router();
const { route } = require('express/lib/application');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { transporter, mailOptions, sendMail } = require("./email");



router.use(bodyParser.json());

router.get('/pendingAppointments', async(req,res)=> {
    try {
        const con=req.db;
        const status='Pending';
        const sql="select p.full_name as patient_name,patient_id,d.full_name as doctor_name,appointment_date,time_slot,appointment_mode,appointment_type from appointments join patients p using(patient_id) join doctors d using(doctor_id) where appointment_status=:1";
        const binds=[status];
        const result=await con.execute(sql,binds);
        console.log(result);
        if(result.rows.length===0){
            res.status(200).json({ status: 'no appointments to approve' });
        }else{
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in pending apointments', error);
        res.status(500).json({ status: 'Internal server error in catch block pending appointments' });
    }
});

router.put('/approveAppointment/:appointmentID', async(req,res)=>{
    try {
        const con=req.db;
        // const status='Scheduled';
        const appointmentID=req.params.appointmentID;
        const binds=[appointmentID];
        const sql="begin updateAppointmentStatus(:1); end;";
        const result=await con.execute(sql,binds);
        console.log(result);
        if (result.rowsAffected === 0) {
            res.status(404).json({ status: 'No appointment found with the provided ID' });
        } else if (result.error) {
            console.error('Error in SQL update appointment status');
            res.status(500).json({ status: 'Internal server error updating appointment status' });
        } else {
            res.status(200).json({ status: 'Appointment approved' });
        }
    } catch (error) {
        console.error('Error in approving apointment status', error);
        res.status(500).json({ status: 'Internal server error in catch block approve appointment' });
    }
});

router.delete('/deleteAppointment/:appointmentID', async(req,res)=>{
    try {
        const con=req.db;
        const appointmentID=req.params.appointmentID;
        const sql="begin deleteAppointment(:1); end;";
        const binds=[appointmentID];
        const result=await con.execute(sql,binds);
        console.log(result);
        if (result.rowsAffected === 0) {
            res.status(404).json({ status: 'No appointment found with the provided ID' });
        } else if (result.error) {
            console.error('Error in SQL delete appointment');
            res.status(500).json({ status: 'Internal server error deleting appointment' });
        } else {
            res.status(200).json({ status: 'Appointment deleted' });
        }
    } catch (error) {
        console.error('Error in deleting apointment', error);
        res.status(500).json({ status: 'Internal server error in catch block delete appointment' });
    }
});

router.get('/allAppointments',async(req,res)=>{
    try {
        const con=req.db;
        const sql="select appointment_id,patient_id,p.full_name as patient_name,doctor_id,d.full_name as doctor_name,appointment_date,time_slot,appointment_mode,appointment_status,appointment_type from appointments join patients p using (patient_id) join doctors d using (doctor_id)"
        const result=await con.execute(sql);
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
        console.error('Error in fetching all apointments', error);
        res.status(500).json({ status: 'Internal server error in catch all appointments' });
    }
});

router.get('/searchAppointments',async(req, res) => {
    try {
        const con=req.db;
        const mode=req.query.mode;
        const status=req.query.status;
        const type=req.query.type;
        const binds=[];
        let sql="select appointment_id,patient_id,p.full_name as patient_name,doctor_id,d.full_name as doctor_name,appointment_date,time_slot,appointment_mode,appointment_status,appointment_type from appointments join patients p using (patient_id) join doctors d using (doctor_id) where 1=1 ";
        if(mode){
            binds.push(mode);
            sql+=" and appointment_mode=:1";
        }
        if(status){
            binds.push(status);
            sql+=" and appointment_status=:2";
        }
        if(type){
            binds.push(type);
            sql+=" and appointment_type=:3";
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
        console.error('Error in searching apointments', error);
        res.status(500).json({ status: 'Internal server error in catch search appointments' });
    }
});

router.get('/allDoctors',async(req,res)=>{
    try {
        const con=req.db;
        const sql="select doctor_id,full_name as doctor_name,dob,phone_number,gender,department_name,mode_of_availibility,time_slot,day from doctors join departments using (department_id) join doctor_schedule using (doctor_id)";
        const result=await con.execute(sql);
        console.log(result);
        if(result.rows.length===0){
            console.log('no doctors');
            res.status(200).json({status:'no doctors'});
        }else{
            var parseResult = JSON.parse(JSON.stringify(result));
            console.log(parseResult.length)
            console.log(parseResult)  
            res.status(200).json(parseResult);
        }
    } catch (error) {
        console.error('Error in fetching all doctors', error);
        res.status(500).json({ status: 'Internal server error in catch all doctors' });
    }
});

router.delete('/deleteDoctor/:doctorID', async(req, res) => {
    try {
        const con=req.db;
        const doctorID=req.params.doctorID;
        const sql="delete from doctors where doctor_id=:1";
        const binds=[doctorID];
        const result=await con.execute(sql,binds);
        console.log(result);
        if (result.rowsAffected === 0) {
            res.status(404).json({ status: 'No doctor found with the provided ID' });
        } else if (result.error) {
            console.error('Error in SQL delete doctor');
            res.status(500).json({ status: 'Internal server error deleting doctor' });
        } else {
            res.status(200).json({ status: 'Doctor deleted' });
        }
    } catch (error) {
        console.error('Error in deleting doctor', error);
        res.status(500).json({ status: 'Internal server error in catch block delete doctor' });
    }
});

router.post('/addDoctor', async(req,res) =>{
    try{
        const con=req.db;
        const fullName=req.body.fullName;
        const email=req.body.email;
        const cnic=req.body.cnic;
        const dob=req.body.dob;
        const gender=req.body.gender;
        const phoneNumber=req.body.phoneNumber;
        const substituteContact=req.body.substituteContact;
        const departmentName=req.body.departmentName;
        console.log(departmentName);
        const briefDescription=req.body.briefDescription;
        const modeOfAvailibility=req.body.modeOfAvailibility;
        const password=req.body.password;
        const favouriteNovel=req.body.favouriteNovel;
        const days=req.body.days;
        const timeSlot=req.body.timeSlot;
        // const clinicNumber=req.body.clinicNumber;
        // const formattedDOB = `TO_DATE('${dob}', 'YYYY-MM-DD')`;
        const role='doctor';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const binds=[departmentName];
        const sql='select department_id from departments where department_name=:1';
        const result=await con.execute(sql,binds);
        console.log(result);
        if(result.error){
            console.error('Error inserting doctor:', result.error);
            res.status(500).json({ status: 'Internal server error insert doctor' });
        }
        else if(result.rows.length===0){
            console.log('no department found of provided name');
        }
        else{
            console.log(result);
            console.log(departmentName);
            console.log('department name found');
            const row=result.rows[0];
            const departmentID=row[0];
            console.log(departmentID);
            const binds1=[fullName,cnic,phoneNumber,dob,email,substituteContact,gender,favouriteNovel,departmentID,briefDescription,modeOfAvailibility];
            const sql1="insert into doctors (full_name,cnic,phone_number,dob,email,substitute_contact,gender,favourite_novel,department_id,brief_description,mode_of_availibility) values (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11)";
            const result1=await con.execute(sql1,binds1);
            console.log(result1);
            if(result1.error){
                console.error('Error inserting doctor:', result1.error);
                res.status(500).json({ status: 'Internal server error insert doctor' });
            }else{
                console.log('inserted into doctor table');
                const binds2=[fullName,cnic,phoneNumber];
                const sql2="select doctor_id from doctors where full_name=:1 and cnic=:2 and phone_number=:3";
                const result2=await con.execute(sql2,binds2);
                console.log(result2);
                if(result2.error){
                    console.error('Error fetching new doctorID:', result2.error);
                    res.status(500).json({ status: 'Internal server error doctorID fetch' });
                }else{
                    console.log('docotrid fetched');
                    const row=result2.rows[0];
                    const userid = row[0];
                    const binds3=[userid,fullName,hashedPassword,role,favouriteNovel,cnic];
                    const sql3="insert into users (user_id,full_name,password,user_role,favourite_novel,cnic) values (:1,:2,:3,:4,:5,:6)";
                    const result3=await con.execute(sql3,binds3);
                    console.log(result3);
                    if(result3.error){
                        console.error('Error inserting user doctor:', result3.error);
                        res.status(500).json({ status: 'Internal server error insert user doctor' });
                    }else{
                        console.log('inserted into user table');
                        const binds4=[userid,days,timeSlot];
                        const sql4="insert into doctor_schedule (doctor_id,day,time_slot) values (:1,:2,:3)";
                        const result4=await con.execute(sql4,binds4);
                        console.log(result4);
                        if(result4.error){
                            console.error('Error inserting doctor schedule:', result4.error);
                            res.status(500).json({ status: 'Internal server error insert doctor schedule' });
                        }else {
                            console.log('inserted into doctor schedule table');
                            await con.commit();
                            console.log('commit made');
                            const dynamicMailOptions = {
                                ...mailOptions,
                                to: [email],
                                subject: `Welcome to Martin Dow`,
                                text: `Hello ${fullName},\n\nYour account has been created successfully.\n\nYour Doctor ID is : ${userid},\n\nThank you for using our service.`,
                            };
                            sendMail(transporter, dynamicMailOptions)
                            .then(() => {
                            res.status(200).json({ status: 'email sent successfully, doctor registered' });
                            })
                            .catch((error) => {
                            console.error('Error sending email:', error);
                            res.status(500).json({ status: 'error sending email to doctor' });
                            });
                        }
                    }
                }
            }
        }
    }catch (error) {
        console.error('Error in addDoctor', error);
        res.status(500).json({ status: 'Internal server error in catch block addDoctor' });
    }
});

module.exports=router;
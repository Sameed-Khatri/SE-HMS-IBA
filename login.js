const { Router } = require('express');
const router = Router();
const { route } = require('express/lib/application');
const bodyParser = require('body-parser');

router.use(bodyParser.json());


router.post('/MartinDow/signin', async(req,res) => {
    try {
        const con=req.db;
        const userid=req.body.userid;
        const password=req.body.password;
        const binds=[userid,password];

        const sql="select * from users where user_id=:1 and password=:2";
        const result=await con.execute(sql,binds);
        console.log(result);

        if (result.rows.length===0){
            res.status(500).json({ status: 'no user found' });
        }else{
            res.status(200).json(result);
        }
    } catch (error) {
        console.error('Error in /some-route:', error);
        res.status(500).json({ status: 'Internal server error' });
    }
});

router.put('/MartinDow/forgotpassword', async(req,res) => {
    try {
        const con=req.db;
        const userid=req.body.userid;
        const cnic=req.body.cnic;
        const novel=req.body.favouriteNovel;
        const newpass=req.body.newPassword
        const binds=[userid,cnic,novel];
        const sql="select user_id,cnic,favourite_novel from users where user_id=:1 and cnic=:2 and favourite_novel=:3";
        const result=await con.execute(sql,binds);
        console.log(result);
        if(result.rows.length===0){
            res.status(500).json({status:'invalid credentials'})
        }else{
            const binds2=[newpass,userid,cnic];
            const sql2="update users set password=:1 where user_id=:2 and cnic=:3";
            const result2=await con.execute(sql2,binds2);
            console.log(result2);
            if (result2.error) {
                // If there's an error during the update, log it and return a server error response
                console.error('Error updating password:', result2.error);
                res.status(500).json({ status: 'Internal server error' });
            } else {
                // If the update was successful, return a success message
                res.status(200).json({ status: 'Password updated successfully' });
            }
        }

    } catch (error) {
        console.error('Error in /some-route:', error);
        res.status(500).json({ status: 'Internal server error' });
    }
});

router.post('/MartinDow/signup', async(req,res) =>{
    try{
        const fullName=req.body.fullName;
        const email=req.body.email;
        const maritalStatus=req.body.maritalStatus;
        const cnic=req.body.cnic;
        const dob=req.body.dob;
        const insuranceID=req.body.insuranceID;
        const gender=req.body.gender;
        const phoneNumber=req.body.phoneNumber;
        const emergencyContact=req.body.emergencyContact;
        const ecName=req.body.emergencyContactName;
        const ecRelation=req.body.emergencyContactRelation;
        const ecEmail=req.body.emergencyContactEmail;
        const password=req.body.password;
        const favouriteNovel=req.body.favouriteNovel;
        const formattedDOB = `TO_DATE('${dob}', 'YYYY-MM-DD')`;
        const role='patient';

        const binds1=[fullName,email||null,maritalStatus,cnic,formattedDOB,insuranceID||null,gender,phoneNumber,emergencyContact,ecName,ecRelation,ecEmail||null,password,favouriteNovel];
        const sql1="insert into patients (full_name,cnic,phone_number,dob,marital_status,email,insurance_id,gender,favourite_novel) values (:1,:2,:3,:4,:5,:6,:7,:8,:9)";
        const result1=await con.execute(sql1,binds1);
        console.log(result1);
        if(result1.error){
            console.error('Error inserting patient:', result1.error);
            res.status(500).json({ status: 'Internal server error insert patient' });
        }else{
            const binds2=[fullName,cnic,phoneNumber];
            const sql2="select patient_id from patients where full_name=:1 and cnic=:2 and phone_number=:3";
            const result2=await con.execute(sql2,binds2);
            console.log(result2);
            if(result2.error){
                console.error('Error fetching new patientID:', result2.error);
                res.status(500).json({ status: 'Internal server error patientID fetch' });
            }else{
                const userid = result2.rows[0].patient_id;
                const binds3=[userid,fullName,password,role,favouriteNovel,cnic];
                const sql3="insert into users (user_id,full_name,password,user_role,favourite_novel,cnic) values (:1,:2,:3,:4,:5,:6)";
                const result3=await con.execute(sql3,binds3);
                if(result3.error){
                    console.error('Error inserting user patient:', result3.error);
                    res.status(500).json({ status: 'Internal server error insert user patient' });
                }else{
                    res.status(200).json({status:'patient and user created successfully'});
                }
            }
        }
    }catch (error) {
        console.error('Error in signup', error);
        res.status(500).json({ status: 'Internal server error signup' });
    }
});

module.exports=router;
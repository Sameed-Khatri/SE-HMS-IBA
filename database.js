const oracle=require('oracledb');

const configuration={
    user:'c##projectData',
    password:'12345',
    connectString:'localhost/orcl'
};

async function connection(){
    try {
        const con=await oracle.getConnection(configuration);
        console.log("connected to oracledb");
        return con;
    } catch (error) {
        console.error("error connection to oracledb:",error);
        throw error;
    }
}
module.exports=connection;
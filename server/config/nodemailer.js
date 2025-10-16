import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    host:
'smtp-relay.brevo.com',
port:587,
auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS,
}
});
transporter.verify((error,success)=>{
    if(error){
        console.log('SMTP failed',error);
    }else{
        console.log('SMTP is ready')
    }
})

export default transporter;
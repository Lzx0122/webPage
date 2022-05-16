import nodemailer from 'nodemailer';




function sendEmail(strSubject, strText, toEmali) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'soarhorizon123@gmail.com',
            pass: 'noob123456'
        }
    })


    let options = {
        from: 'soarhorizon123@gmail.com',
        to: toEmali,
        subject: strSubject,
        text: strText

    }
    console.log("sendEmail")
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return
        }
        console.log(info.response)
    })
}
export { sendEmail }
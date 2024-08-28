import nodemailer from 'nodemailer';

// Thiết lập transporter với cấu hình email của bạn
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true cho 465, false cho các port khác
  auth: {
    user: 'minhtai2019cb2@gmail.com', // Email của bạn
    pass: 'cqnd drcp mfuu vkkz' // Mật khẩu email của bạn
  }
});

// Hàm gửi email
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  const mailOptions = {
    from: 'minhtai2019cb2@gmail.com', // Email người gửi
    to, // Email người nhận
    subject, // Chủ đề email
    html: htmlContent, // Nội dung HTML của email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

// Sử dụng hàm sendEmail để gửi email

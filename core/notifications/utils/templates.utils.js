const whatsappTemplates = {
  userRegistration: (username, email, password) =>
    `*Dear ${username},*\n\nThank you for registering with us at *Innovative Study Circle*! \n\nWe are excited to have you join us.\n\nHere are your login credentials:\n📧 *Email:* ${email}\n🔑 *Password:* ${password}\n\nFor more details, please visit our website: https://isc.guru\n\n*Warm regards,*\n_The Innovative Study Circle Team_`,

  taskAssignment: (username, title, creator, targetDate) => 
    `✨ *Hello ${username},* ✨\n\n`
    + `📢 *Greetings from Innovative Study Circle!* 📢\n\n`
    + `✅ *A new task has been assigned to you!* ✅\n\n`
    + `📌 *Task Title:* *${title}* \n`
    + `👤 *Assigned By:* ${creator} \n`
    + `🎯 *Assigned To:* ${username} \n`
    + `📅 *Target Date:* ${targetDate} \n\n`
    + `🔗 *Please log in to your account to view the task details.*\n\n`
    + `💡 *Need help? Feel free to reach out!* \n\n`
    + `*Warm regards,*\n`
    + `_The Innovative Study Circle Team_ 💼`
};

export default whatsappTemplates;

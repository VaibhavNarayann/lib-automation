import twilio from "twilio"; 
import dotenv from 'dotenv';
import { appengine } from "googleapis/build/src/apis/appengine/index.js";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client =  twilio(accountSid, authToken); 

async function createMessage(){
    const message = await client.messages.create({
        contentSid : "HXb5b62575e6e4ff6129ad7c8efe1f983e",
        contentVariables: JSON.stringify({ 1: "22 July 2026", 2: "3:15pm" }),
          from: "whatsapp:+14155238886",
          to : "whatsapp:+918587963742"
    });

    console.log(message.body)

}

// createMessage();



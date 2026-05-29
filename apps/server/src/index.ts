import express from "express" 
import {google} from "googleapis"	
import cors from "cors"
import dotenv from 'dotenv';
import MessagingResponse from "twilio/lib/twiml/MessagingResponse.js";
import twilio from "twilio";
import { addOrUpdateRow, getSheetData } from "./store/getSheetData.js";
dotenv.config();
export type SheetRow = Record<string, string>;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const credentials  = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

const SPREADSHEET_ID = process.env.SPREADSHEET_ID!; 

	const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
}); 

const sheets = google.sheets({ version: 'v4', auth });
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client =  twilio(accountSid, authToken); 

//This endpoint append users data -> google sheet
app.post("/post", async(req , res)=> {
	const {name, number, address} = req.body;
    if(!name || !number || !address  ){
    return res.status(401).json({message: "All fields are required"})
    } 
	try {
		// Append new row so old registrations are kept; range A:B = append to next empty row
		await sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: 'Sheet1!A:C',
			valueInputOption: 'USER_ENTERED',
			insertDataOption: 'INSERT_ROWS',
			requestBody: {
				values: [[name, number, address]],
			},
		});
		res.status(201).json({ message: "Registration added" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to write sheet" });
	}
})

// /webhook is for whatsapp chat part
app.post("/webhook", async (req, res) => {
  const incomingMsg = req.body.Body;
  const twiml = new MessagingResponse();

  try {
    const data = await getSheetData();
    let reply = "❌ I didn't understand";

    // ================== CASE 1: SHOW ALL ==================
    if (incomingMsg === "all") {
      if (data.length === 0) {
        reply = "No data found";
      } else {
        // reply = data.map((row:any) => `${row.members} - ${row.contact} - ${row.fees}`).join("\n");
        reply = data.map((row: any, index: number) => 
        `*${index + 1}. ${row.name}*\n` +
        `   📞 Contact: ${row.contact}\n` +
        `   💰 Fees: ${row.fees}\n`+
        `   🏠 Address: ${row.address} `
      ).join("\n\n");
        
      }
    }

    // // ================== CASE 2: ADD ENTRY ==================
    else if (incomingMsg.startsWith("add ")) {
      const parts = incomingMsg.split(" ")
      if (parts.length < 4) {
        reply = "Format: add name fee";
      } else {
        const name = parts[1];
        const fees = parts[2];

        const result = await addOrUpdateRow(name, fees);

        if (result === "updated") {
          reply = `♻️ Updated ${name} fee to ₹${fees}`;
        } else {
          reply = `✅ Added ${name} with ₹${fees}`;
        }
      }
    }

    // ================== CASE 3: GET BY NAME ==================
    else {
      const result = data.find(
        (row:any) => row.members.toLowerCase() === incomingMsg
      );

      if (result) {
        reply = `Name: ${result.members}\nFee: ₹${result.fee}`;
      } else {
        reply = "No data found 😢";
      }
    }

    twiml.message(reply);

  } catch (err) {
    console.error(err);
    twiml.message("⚠️ Server error");
  }

  res.type("text/xml").send(twiml.toString());
});



app.listen(3000, () => console.log("Server running on port 3000"));
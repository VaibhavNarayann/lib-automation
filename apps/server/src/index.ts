import express from "express" 
import {google} from "googleapis"	
import cors from "cors"
import dotenv from 'dotenv';
import MessagingResponse from "twilio/lib/twiml/MessagingResponse.js";
import twilio from "twilio"; 
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

app.get("/", async (req,res)=> {
	// try {
	// 	const response = await sheets.spreadsheets.values.get({
    // spreadsheetId: SPREADSHEET_ID,
    // range: 'Sheet1!A1:D10', 
  	// });

	// 	const rows = response.data.values;	
	// 	console.log('Data:', rows);
  	// 	res.json({data: rows});
	// }catch(error){
	// 	console.error(error); 
	// 	res.status(500).json({error : "Failed to read sheet"})
	// }

})


app.post("/post", async(req , res)=> {
	const {name, number} = req.body;
	try {
		// Append new row so old registrations are kept; range A:B = append to next empty row
		await sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: 'Sheet1!A:B',
			valueInputOption: 'USER_ENTERED',
			insertDataOption: 'INSERT_ROWS',
			requestBody: {
				values: [[name, number]],
			},
		});
		res.status(201).json({ message: "Registration added" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to write sheet" });
	}
})

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
        reply = data.map((row:any) => `${row.name} - ${row.number}`).join("\n");
      }
    }

    // ================== CASE 2: ADD ENTRY ==================
    // else if (incomingMsg.startsWith("add")) {
    //   // format: add vaibhav 5000
    //   const parts = incomingMsg.split(" ");

    //   if (parts.length < 3) {
    //     reply = "Format: add name fee";
    //   } else {
    //     const name = parts[1];
    //     const number = parts[2];

    //     await addRow(name, number);
    //     reply = `✅ Added: ${name} - ₹${fee}`;
    //   }
    // }

    // ================== CASE 3: GET BY NAME ==================
    else {
      const result = data.find(
        (row:any) => row.name.toLowerCase() === incomingMsg
      );

      if (result) {
        reply = `Name: ${result.name}\nFee: ₹${result.fee}`;
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


async function getSheetData() {
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID!

    const response = await  sheets.spreadsheets.values.get({
        spreadsheetId : SPREADSHEET_ID,
        range: 'Sheet1!A:B',
    })
    
    const rows:any = response.data.values; 

     if (!rows || rows.length < 2) return [];

     const headers: string[] = rows[0].map((h:string) => h.trim().toLowerCase());

     const data = rows.slice(1).map((row:any) => {
    const obj: SheetRow  = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
 
  return data;
}

app.listen(3000, () => console.log("Server running on port 3000"));
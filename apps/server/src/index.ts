import express from "express" 
import {google} from "googleapis"	
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();

const app = express(); 
app.use(express.json());
app.use(cors());

const credentials  = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

const SPREADSHEET_ID = "19Z1XH2btxOUfhZv_SSMcZQPqns7jBeyovdeXj66BtJA";

	const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
}); 

	const sheets = google.sheets({ version: 'v4', auth });



app.get("/", async (req,res)=> {
	try {
		const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:D10', 
  });

		const rows = response.data.values;	
		console.log('Data:', rows);
  		res.json({data: rows});
	}catch(error){
		console.error(error); 
		res.status(500).json({error : "Failed to read sheet"})
	}
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


app.listen(3000, () => console.log("Server running on port 3000"));

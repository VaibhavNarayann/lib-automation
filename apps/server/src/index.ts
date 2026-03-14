import express from "express" 
const app = express(); 
import {google} from "googleapis"	
import dotenv from 'dotenv';
dotenv.config();

app.use(express.json())

const credentials  = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);


app.get("/", async (req,res)=> {
	const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
}); 

	const client = await auth.getClient();

	const sheets = google.sheets({ version: 'v4', auth });

	const SPREADSHEET_ID = "19Z1XH2btxOUfhZv_SSMcZQPqns7jBeyovdeXj66BtJA";

	// READ data from a sheet
	async function readSheet() {
  	const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:D10', // Adjust range as needed
  });

  const rows = response.data.values;
  console.log('Data:', rows);
  return rows;

	}
	readSheet(); 
})


app.listen(3000, () => console.log("Server running on port 3000"));

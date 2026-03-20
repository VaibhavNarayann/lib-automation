import { google } from "googleapis";

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);



	const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
}); 

	const sheets = google.sheets({ version: 'v4', auth });


async function getSheetData() {
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID!

    const response = await  sheets.spreadsheets.values.get({
        spreadsheetId : SPREADSHEET_ID,
        range: 'Sheet1!A:B',
    })
    
    const rows:any = response.data.values; 

     if (!rows || rows.length < 2) return [];

     const headers:any = rows[0].map((h:any) => h.trim().toLowerCase());

     const data = rows.slice(1).map((row:any) => {
    const obj:any = {};
    headers.forEach((header:any, i:any) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
 
  return data;
}

export default getSheetData;
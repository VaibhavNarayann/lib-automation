import {google} from "googleapis"	
import dotenv from 'dotenv';
dotenv.config();
export type SheetRow = Record<string, string>;


const credentials  = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

    const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
}); 

const sheets = google.sheets({ version: 'v4', auth });


export async function getSheetData() {
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID!

    const response = await  sheets.spreadsheets.values.get({
        spreadsheetId : SPREADSHEET_ID,
        range: 'Sheet1!A:D',
    })
    
    const rows:any = response.data.values; 

     if (!rows || rows.length < 3) return [];

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


const SPREADSHEET_ID = process.env.SPREADSHEET_ID!; 


// export async function addRow(name: string, fee: string) {
  
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Sheet1!A:C", // members, contact, fees (or whatever your columns are)
//       valueInputOption: "USER_ENTERED",
//     //   insertDataOption: "INSERT_ROWS",
//       requestBody: {
//         values: [[name, fee]], // add fee here too if needed: [name, number, fee]
//       },
//     });
//   }



export async function addOrUpdateRow(name: string, fees: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:D",
  });

  const rows:any = res.data.values || [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const existingName = rows[i][0]?.toLowerCase();

    if (existingName === name.toLowerCase()) {
      const rowNumber = i + 1;

      // Update only fee column (C)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Sheet1!D${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[`₹${fees}`]],
        },
      });

      return "updated";
    }
  }

  // If not found, add new row
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[name, "", fees]],
    },
  });

  return "added";
}
 
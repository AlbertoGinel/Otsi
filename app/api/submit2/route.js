import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheet",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: "v4",
    });

    // const response = await sheets.spreadsheets.values.get({
    //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //   range: "A2",
    // });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = "Sheet1"; // Replace with the name of your sheet
    const range = `${sheetName}!A1:Z1000`; // Adjust the range based on your sheet size

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    console.log("algo sale: ", response);

    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
    return new NextResponse("Something went wrong", { status: 400 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Data Types:", {
      name: typeof body.name,
      email: typeof body.email,
      phone: typeof body.phone,
      message: typeof body.message,
    });

    //console.log("privatekey: ", process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"));

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheet",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: "v4",
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A2:D2",
      valueInputOption: "USER_ENTERED",
      updates: {
        values: [[body.name, body.email, body.phone, body.message]],
      },
    });

    console.log("Google Sheets API response:", response.data);

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (e) {
    console.error("Error submitting form:", e.message);
    return NextResponse.json(
      { message: e.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}

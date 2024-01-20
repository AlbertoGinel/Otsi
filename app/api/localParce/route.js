// Importing the correct 'stringify' function from 'csv-stringify'
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import fs from "fs/promises";
import { NextResponse } from "next/server";

const csvFilePath = "./public/tables/Sheet1.csv";

export async function getCsvData() {
  try {
    const fileContent = await fs.readFile(csvFilePath, "utf-8");

    const parser = parse({ columns: true, skip_empty_lines: true });
    const data = [];

    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        data.push(record);
      }
    });

    parser.on("error", (err) => {
      console.error(err);
      return new NextResponse("Error parsing CSV file", { status: 500 });
    });
    parser.write(fileContent);
    parser.end();

    return data;
  } catch (e) {
    console.error(e);
    return new NextResponse("Error reading CSV file", { status: 500 });
  }
}

export async function setCsvData(newData) {
  try {
    const csvString = await stringify(newData, { header: true });
    await fs.writeFile(csvFilePath, csvString, "utf-8");
  } catch (e) {
    console.error(e);
    return new NextResponse("Error setting CSV data", { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await getCsvData();

    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Error getting CSV data", { status: 400 });
  }
}

export async function POST(req) {
  try {
    const requestBody = await req.text();
    const newData = JSON.parse(requestBody);

    await setCsvData(newData);

    return new NextResponse("CSV data updated successfully", {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Error updating CSV data", { status: 400 });
  }
}

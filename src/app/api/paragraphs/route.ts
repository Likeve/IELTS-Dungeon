import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE_PATH = path.join(process.cwd(), "src/data/ieltsChartsParagraphs.ts");

export async function GET() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const match = raw.match(/export const PARAGRAPHS_DATA: Record<string, ChartParagraphs> = (\{[\s\S]*?\n\};)/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: "Could not parse PARAGRAPHS_DATA from file" }, { status: 500 });
    }
    const data = new Function(`return ${match[1]}`)();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const json = JSON.stringify(body, null, 2);
    const newContent = `export const PARAGRAPHS_DATA: Record<string, ChartParagraphs> = ${json};`;
    fs.writeFileSync(FILE_PATH, newContent, "utf-8");
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

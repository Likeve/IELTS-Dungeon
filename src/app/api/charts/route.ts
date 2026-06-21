import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "src/data/ieltsCharts.ts");

export async function GET() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const match = raw.match(/export const CHARTS: ChartItem\[\] = (\[[\s\S]*?\];)/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: "Could not parse CHARTS from file" }, { status: 500 });
    }
    const charts = new Function(`return ${match[1].replace(/;$/, "")}`)();
    return NextResponse.json(charts);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const charts = await req.json();
    const raw = fs.readFileSync(FILE_PATH, "utf-8");

    const replacement = `export const CHARTS: ChartItem[] = ${JSON.stringify(charts, null, 2)};`;

    const newRaw = raw.replace(
      /export const CHARTS: ChartItem\[\] = \[[\s\S]*?\];/,
      replacement
    );

    fs.writeFileSync(FILE_PATH, newRaw, "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

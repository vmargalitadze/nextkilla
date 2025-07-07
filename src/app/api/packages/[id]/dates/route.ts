import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET package dates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id);
    
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const dates = await prisma.packageDate.findMany({
      where: { packageId },
      orderBy: { startDate: "asc" },
    });
 
    return NextResponse.json({ dates });
  } catch (error) {
    console.error("Failed to fetch package dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch package dates" },
      { status: 500 }
    );
  }
}

// POST package dates (create/update)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id);
    
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const body = await request.json();
    const { dates } = body;

    if (!Array.isArray(dates)) {
      return NextResponse.json({ error: "Dates must be an array" }, { status: 400 });
    }

    // Delete existing dates for this package
    await prisma.packageDate.deleteMany({
      where: { packageId },
    });

    // Create new dates
    const createdDates = await Promise.all(
      dates.map((date) =>
        prisma.packageDate.create({
          data: {
            packageId,
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            maxPeople: date.maxPeople || 1,
          },
        })
      )
    );

    return NextResponse.json({ dates: createdDates });
  } catch (error) {
    console.error("Failed to save package dates:", error);
    return NextResponse.json(
      { error: "Failed to save package dates" },
      { status: 500 }
    );
  }
} 
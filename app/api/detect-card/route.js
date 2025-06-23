import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cardNumber } = await req.json();

    if (!cardNumber || cardNumber.length < 6) {
      return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
    }

    const bin = cardNumber.slice(0, 6);

    const url = `https://bin-lookup-checker-api.p.rapidapi.com/bincheck?bin=${bin}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "bin-lookup-checker-api.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Make sure this key is in your .env.local
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("RapidAPI Error:", res.status, errorText);
      throw new Error("Failed BIN lookup");
    }

    const data = await res.json();

    const result = {
      bank: data.bank || "Unknown",
      brand: data.scheme || "Unknown",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Server-side BIN lookup failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

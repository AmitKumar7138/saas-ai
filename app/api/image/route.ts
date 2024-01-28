import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "512X512" } = body;
        const freeTrail = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!prompt) {
            return new NextResponse("Prompt is are required", { status: 400 })
        }

        if (!amount) {
            return new NextResponse("Amount is are required", { status: 400 })
        }

        if (!resolution) {
            return new NextResponse("Resolution is are required", { status: 400 })
        }

        if (!freeTrail && !isPro) {
            return new NextResponse("Free trail has expired.", { status: 403 });
        }


        const response = await openai.images.generate({
            prompt: prompt,
            n: parseInt(amount, 10),
            size: resolution,
        })


        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.data);


    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}
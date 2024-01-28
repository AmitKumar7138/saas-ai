import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer only im markdown code snippets.Use code comments for explanation"
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        const freeTrail = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!messages) {
            return new NextResponse("Message are required", { status: 400 })
        }



        if (!freeTrail && !isPro) {
            return new NextResponse("Free trail has expired.", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages],
        })


        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.choices[0].message);


    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}
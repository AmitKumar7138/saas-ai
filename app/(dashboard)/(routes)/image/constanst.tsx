import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image Prompt is required"
    }),
    amount: z.string().min(1),
    resolution: z.string().min(1)
});

type Option = {
    value: string;
    label: string;
};

export const amountOptions: Option[] = [];

for (let i = 1; i < 6; i++) {
    amountOptions.push({
        value: i.toString(),
        label: `${i} ${i === 1 ? "Photo" : "Photos"}`
    });
}

const res = ["256", "512", "1024"]
export const resolutionOptions: Option[] = [];

for (let i = 0; i < res.length; i++) {
    resolutionOptions.push({
        value: `${res[i]}x${res[i]}`,
        label: `${res[i]}x${res[i]}`,
    })
}

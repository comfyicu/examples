const fetch = require("node-fetch");

const seed = Math.floor(Math.random() * 1125899906842624)

const workflow_id = "<REPLACE_THIS>"

const prompt = { "3": { "inputs": { "cfg": 6, "seed": seed, "model": ["4", 0], "steps": 30, "denoise": 1, "negative": ["7", 0], "positive": ["6", 0], "scheduler": "karras", "latent_image": ["5", 0], "sampler_name": "dpmpp_2m" }, "class_type": "KSampler" }, "4": { "inputs": { "ckpt_name": "juggernautXL_juggernautX.safetensors" }, "class_type": "CheckpointLoaderSimple" }, "5": { "inputs": { "width": 1024, "height": 1024, "batch_size": 1 }, "class_type": "EmptyLatentImage" }, "6": { "inputs": { "clip": ["4", 1], "text": "Car Photography, a sexy super car limited edition in the streets, rain, neon colours, gloomy atmosphere, faded film, film grain" }, "class_type": "CLIPTextEncode" }, "7": { "inputs": { "clip": ["4", 1], "text": "worst quality, greyscale, watermark, username, signature, text," }, "class_type": "CLIPTextEncode" }, "8": { "inputs": { "vae": ["4", 2], "samples": ["3", 0] }, "class_type": "VAEDecode" }, "9": { "inputs": { "images": ["8", 0], "filename_prefix": "ComfyICU" }, "class_type": "SaveImage" } };

async function runWorkflow(body) {
    const url =
        "https://comfy.icu/api/v1/workflows/" + body.workflow_id + "/runs";
    const resp = await fetch(url, {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer " + process.env.COMFYICU_API_KEY,
        },
        body: JSON.stringify(body),
        method: "POST",
    });

    return await resp.json();
}


async function getRunStatus(workflow_id, run_id) {
    const url =
        "https://comfy.icu/api/v1/workflows/" + workflow_id + "/runs/" + run_id;
    const resp = await fetch(url, {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer " + process.env.COMFYICU_API_KEY,
        },
    });
    return await resp.json();
}

async function pollRunStatus(
    workflow_id,
    run_id,
    maxAttempts = 30,
    delay = 10000
) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const status = await getRunStatus(workflow_id, run_id);
            console.log(`Attempt ${attempt + 1}: Run status is ${status.status}`);

            if (status.status === "COMPLETED" || status.status === "ERROR") {
                return status;
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
        } catch (error) {
            console.error(`Error during polling: ${error.message}`);
            throw error;
        }
    }

    throw new Error("Max polling attempts reached");
}

async function main() {
    try {
        const run = await runWorkflow({ workflow_id, prompt });
        console.log(run);
        const finalStatus = await pollRunStatus(workflow_id, run.id);
        console.log(`Final status: ${finalStatus.status}`)
        console.log(`Output: ${JSON.stringify(finalStatus.output, null, 2)}`);
    } catch (error) {
        if (error.message === "Max polling attempts reached") {
            console.log(`Polling timed out: ${error.message}`);
        } else {
            console.log(`An error occurred while polling: ${error.message}`);
        }
    }
}

main();

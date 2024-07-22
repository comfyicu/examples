

import os
import requests
import json
import time
import math
import random

seed = math.floor(random.random() * 1125899906842624)

workflow_id = "<REPLACE_THIS>"

prompt = {"3": {"inputs": {"cfg": 6, "seed": seed, "model": ["4", 0], "steps": 30, "denoise": 1, "negative": ["7", 0], "positive": ["6", 0], "scheduler": "karras", "latent_image": ["5", 0], "sampler_name": "dpmpp_2m"}, "class_type": "KSampler"}, "4": {"inputs": {"ckpt_name": "juggernautXL_juggernautX.safetensors"}, "class_type": "CheckpointLoaderSimple"}, "5": {"inputs": {"width": 1024, "height": 1024, "batch_size": 1}, "class_type": "EmptyLatentImage"}, "6": {"inputs": {"clip": ["4", 1], "text": "Car Photography, a sexy super car limited edition in the streets, rain, neon colours, gloomy atmosphere, faded film, film grain"}, "class_type": "CLIPTextEncode"}, "7": {"inputs": {"clip": ["4", 1], "text": "worst quality, greyscale, watermark, username, signature, text,"}, "class_type": "CLIPTextEncode"}, "8": {"inputs": {"vae": ["4", 2], "samples": ["3", 0]}, "class_type": "VAEDecode"}, "9": {"inputs": {"images": ["8", 0], "filename_prefix": "ComfyICU"}, "class_type": "SaveImage"}}

def run_workflow(body):
    url = "https://comfy.icu/api/v1/workflows/" + body['workflow_id'] + "/runs"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.environ['COMFYICU_API_KEY']
    }
    response = requests.post(url, headers=headers, json=body)
    return response.json()

def get_run_status(workflow_id, run_id):
    url = f"https://comfy.icu/api/v1/workflows/{workflow_id}/runs/{run_id}"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.environ['COMFYICU_API_KEY']
    }
    response = requests.get(url, headers=headers)
    return response.json()

def poll_run_status(workflow_id, run_id, max_attempts=30, delay=10):
    for attempt in range(max_attempts):
        status = get_run_status(workflow_id, run_id)
        print(f"Attempt {attempt + 1}: Run status is {status['status']}")

        if status['status'] in ['COMPLETED', 'ERROR']:
            return status

        time.sleep(delay)

    raise TimeoutError("Max polling attempts reached")

try:
    run = run_workflow({"workflow_id": workflow_id, "prompt": prompt})
    print(run)
    final_status = poll_run_status(workflow_id, run['id'])
    print(f"Final status: {final_status['status']}")
    print(f"Output: {json.dumps(final_status['output'], indent=2)}")
except TimeoutError as e:
    print(f"Polling timed out: {e}")
except requests.exceptions.RequestException as e:
    print(f"An error occurred while polling: {e}")

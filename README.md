# ComfyICU API Examples

## Introduction

ComfyICU provides a robust REST API that allows you to seamlessly integrate and execute your custom ComfyUI workflows in production environments. Our API is designed to help developers focus on creating innovative AI experiences without the burden of managing GPU infrastructure.

This repository contains working examples, sample code, and additional documentation to help you get the most out of the ComfyICU API.

## Getting Started

First, you'll need to create an API key. You can do this from your [account settings](https://comfy.icu/account) page. Once you have your key, add it to your environment variable like so:

```bash
export COMFYICU_API_KEY=XXX
```

Then clone this repo

```bash
git clone https://github.com/comfyicu/examples.git
cd examples
```

## Javascript

Install node-fetch to make API requests

```bash
cd javascript/
npm install node-fetch@2 --save
```

Edit `simple.js` and replace `workflow_id`

```bash
node simple.js
```

## Python

Install requests to make API requests

```bash
cd python/
pip install requests
```

Edit `simple.py` and replace `workflow_id`

```bash
python simple.py
```

You should be able to see output like below

```bash
{'id': 'APCmAT2lf8O6sAgk2Svf2'}
Attempt 1: Run status is QUEUED
Attempt 2: Run status is STARTED
Attempt 3: Run status is COMPLETED
Final status: COMPLETED
Output: [
{
"filename": "/workflows/6bAK1X_Y7QERnV30MZdo2/output/APCmAT2lf8O6sAgk2Svf2/ComfyICU_00001_.png",
"url": "https://r2.comfy.icu/workflows/6bAK1X_Y7QERnV30MZdo2/output/APCmAT2lf8O6sAgk2Svf2/ComfyICU_00001_.png",
"thumbnail_url": "https://img.comfy.icu/sig/width:300/quality:85/aHR0cHM6Ly9yMi5jb21meS5pY3Uvd29ya2Zsb3dzLzZiQUsxWF9ZN1FFUm5WMzBNWmRvMi9vdXRwdXQvQVBDbUFUMmxmOE82c0FnazJTdmYyL0NvbWZ5SUNVXzAwMDAxXy5wbmc="
}
]
```

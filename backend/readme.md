# Setting up environment

## 1. Install python:

Python is recommended to be installed via Anaconda.

https://www.anaconda.com/products/individual

## 2. Setup conda environment

### Method 1: Install from environment.yml file

> `conda env create -f environment.yml`

A conda environment will bre automatically created with all the required dependencies.

Activate the environment using

> `activate IS5009`

### Method 2: Setup yourself

If you already have a python environment, simply make sure you have the following libraries installed
- pandas
- flask
- flask-cors

# Starting app

In the same folder as `backend\`, run

> `python backend.py`

You should see:

![image](demo1.jpg)

This means that the server is up and running successfully.
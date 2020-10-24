import json
import pandas as pd
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

def calculate_ocbc (df):
    # OCBC 365 cashback card parameters
    dining = 0.06
    grocery = 0.03
    petrol = 0.05
    land_transport = 0.03
    utilities = 0.03
    online_travel = 0.03
    others = 0.003
    max_threshold = 80
    min_spend = 800
  
    # calculate individual category
    df_grouped = df.groupby('transaction_cat').sum()
    if 'D' in df.transaction_cat.values:
        dining_cashback = df_grouped.loc['D'].values * dining
    else: dining_cashback = 0

    if 'G' in df.transaction_cat.values:
        grocery_cashback = df_grouped.loc['G'].values * grocery
    else: grocery_cashback = 0

    if 'P' in df.transaction_cat.values:
        petrol_cashback = df_grouped.loc['P'].values * petrol
    else: petrol_cashback = 0

    if 'L' in df.transaction_cat.values:
        land_transport_cashback = df_grouped.loc['L'].values * land_transport
    else: land_transport_cashback = 0

    if 'U' in df.transaction_cat.values:
        utilities_cashback = df_grouped.loc['U'].values * utilities
    else: utilities_cashback = 0

    if 'T' in df.transaction_cat.values:
        online_travel_cashback = df_grouped.loc['T'].values * online_travel
    else: online_travel_cashback = 0

    if 'X' in df.transaction_cat.values:
        others_cashback = df_grouped.loc['X'].values * others
    else: others_cashback = 0

    # calculate total bonus cashback
    cashback_total = min(max_threshold, dining_cashback + grocery_cashback + petrol_cashback + land_transport_cashback + utilities_cashback + online_travel_cashback + others_cashback)

    # check min_spend
    if df['amount_spend'].sum() >= min_spend:
        cashback_final = cashback_total
    else: 
        cashback_final = min(max_threshold, df['amount_spend'].sum()*others)

    return cashback_final

def calculate_citi (df):
    # Citi cashback card parameters
    dining = 0.08
    grocery = 0.08
    petrol = 0.08
    land_transport = 0
    utilities = 0
    online_travel = 0
    others = 0.0025
    max_threshold = 25
    min_spend = 888

    # calculate individual category
    df_grouped = df.groupby('transaction_cat').sum()
    if 'D' in df.transaction_cat.values:
        dining_cashback = min(df_grouped.loc['D'].values * dining, max_threshold)
    else: dining_cashback = 0

    if 'G' in df.transaction_cat.values:
        grocery_cashback = min(df_grouped.loc['G'].values * grocery, max_threshold)
    else: grocery_cashback = 0

    if 'P' in df.transaction_cat.values:
        petrol_cashback = min(df_grouped.loc['P'].values * petrol, max_threshold)
    else: petrol_cashback = 0

    if 'L' in df.transaction_cat.values:
        land_transport_cashback = min(df_grouped.loc['L'].values * land_transport, max_threshold)
    else: land_transport_cashback = 0

    if 'U' in df.transaction_cat.values:
        utilities_cashback = min(df_grouped.loc['U'].values * utilities, max_threshold)
    else: utilities_cashback = 0

    if 'T' in df.transaction_cat.values:
        online_travel_cashback = min(df_grouped.loc['T'].values * online_travel, max_threshold)
    else: online_travel_cashback = 0

    if 'X' in df.transaction_cat.values:
        others_cashback = df_grouped.loc['X'].values * others
    else: others_cashback = 0

    # calculate total bonus cashback
    cashback_total = dining_cashback + grocery_cashback + petrol_cashback + land_transport_cashback + utilities_cashback + online_travel_cashback + others_cashback

    # check min_spend
    if df['amount_spend'].sum() >= min_spend:
        cashback_final = cashback_total
    else: 
        cashback_final = df['amount_spend'].sum()*others

    return cashback_final

def calculate_boc (df):
    # Bank of China Family cashback card parameters
    dining = 0.1
    grocery = 0.03
    online = 0.03
    hospital = 0.03
    land_transport = 0.03
    merchants = 0.05
    movies = 0.1
    others = 0.0025
    max_threshold = 25
    min_spend = 800

    # calculate individual category
    df_grouped = df.groupby('transaction_cat').sum()
    if 'D' in df.transaction_cat.values:
        dining_cashback = min(df_grouped.loc['D'].values * dining, max_threshold)
    else: dining_cashback = 0

    if 'G' in df.transaction_cat.values:
        grocery_cashback = min(df_grouped.loc['G'].values * grocery, max_threshold)
    else: grocery_cashback = 0

    if 'O' in df.transaction_cat.values:
        online_cashback = min(df_grouped.loc['O'].values * online, max_threshold)
    else: online_cashback = 0

    if 'H' in df.transaction_cat.values:
        hospital_cashback = min(df_grouped.loc['H'].values * hospital, max_threshold)
    else: hospital_cashback = 0

    if 'L' in df.transaction_cat.values:
        land_transport_cashback = min(df_grouped.loc['L'].values * land_transport, max_threshold)
    else: land_transport_cashback = 0

    if 'M' in df.transaction_cat.values:
        merchant_cashback = min(df_grouped.loc['M'].values * merchants, max_threshold)
    else: merchant_cashback = 0

    if 'E' in df.transaction_cat.values:
        movies_cashback = min(df_grouped.loc['E'].values * movies, max_threshold)
    else: movies_cashback = 0

    if 'X' in df.transaction_cat.values:
        others_cashback = df_grouped.loc['X'].values * others
    else: others_cashback = 0

    # calculate total bonus cashback
    cashback_total = dining_cashback + grocery_cashback + online_cashback + hospital_cashback + land_transport_cashback + merchant_cashback + movies_cashback + others_cashback

    # check min_spend
    if df['amount_spend'].sum() >= min_spend:
        cashback_final = cashback_total
    else: 
        cashback_final = df['amount_spend'].sum()*others

    return cashback_final

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/calculate', methods=['POST'])
def calculate():
    file = request.files['data']
    df = pd.read_csv(file, usecols = [0,1,2,3])
    # print(df.head())
    
    ocbc_cashback = calculate_ocbc(df).tolist()
    citi_cashback = calculate_citi(df).tolist()
    boc_cashback = calculate_boc(df).tolist()
    
    return {'data': {'ocbc': ocbc_cashback, 'citi': citi_cashback, 'bank of china': boc_cashback}}

if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)
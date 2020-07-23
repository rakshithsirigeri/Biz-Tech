# -*- coding: utf-8 -*-
"""
Created on Tue Apr  7 21:46:44 2020

@author: Suraj
"""
import re
import requests
import json

url = "https://currency-converter5.p.rapidapi.com/currency/convert"



headers = {
    'x-rapidapi-host': "currency-converter5.p.rapidapi.com",
    'x-rapidapi-key': "e9aa6affdfmsh1e9ae2e6dd92c34p13fe75jsn9837fcb98559"
    }

file1=open("convert.txt","w")

with open('src.txt','r+') as file: 
   
    # reading each line     
    for line in file: 
   
        # reading each word         
        #for word in line.split(): 
        x = re.search("(AUD|BGN|BRL|CAD|CHF|CNY|DKK|CZK|EUR|GBP|HKD|HRK|HUF|IDR|ILS|INR|ISK|JPY|KRW|MXN|MYR|NOK|NZD|PHP|PLN|RON|RUB|SEK|SGD|THB|TRY|USD|ZAR)\d+", line)        
        # displaying the words
        if x != None:
            word=x.group()
            print(word)
            curr=word[0:3]
            print(curr)
            amt=word[3:]
            print(amt)
            querystring = {"format":"json","from":curr,"to":"USD","amount":amt}
            response = requests.request("GET", url, headers=headers, params=querystring)
            a=response.text.split("\"")[27]
            print(a)
            b= "USD"+a
            print(b)
            newline= re.sub(word,b,line)
            print(newline)
            file1.write(newline)
            #print(a["rates"]["USD"]["rate_for_amount"])
        else:
            file1.write(line)

file.close()
file1.close()
            

#GBPbase = input("Value: ")

#querystring = {"format":"json","from":"INR","to":"USD","amount":"100"}

#response = requests.request("GET", url, headers=headers, params=querystring)

#print(response.text)
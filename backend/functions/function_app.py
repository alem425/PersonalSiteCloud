#Python Version 3.11
#NPM Install -g azure-functions-core-tools@4 --unsafe-perm true
import azure.functions as func # Make sure to pip install requirements.txt
import datetime
import json
import logging

app = func.FunctionApp()
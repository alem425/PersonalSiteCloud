#AWS lambda function file that fetches project data from DynamoDB and returns it as JSON
# Will take this JSON info and send to the frontend
#Boto3 is used to interact with AWS services

import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("projects")

def lambda_handler(event, context):
    response = table.scan()
    projects = response.get("Items",[])

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(projects)
    }
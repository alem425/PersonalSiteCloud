#Python Version 3.11
#NPM Install -g azure-functions-core-tools@4 --unsafe-perm true
import azure.functions as func # Make sure to pip install requirements.txt
from azure.cosmos import CosmosClient
import datetime
import json
import logging
import os
from azure.storage.blob import BlobServiceClient
import uuid



app = func.FunctionApp()

@app.function_name("Add_Project")
@app.route(route="AddProject", methods=["POST", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
@app.queue_output(arg_name="msg", queue_name="outqueue", connection="AzureWebJobsStorage")
@app.cosmos_db_output(arg_name="outputDocument", database_name="portfolio-db", 
    container_name="projects", connection="CosmosDbConnectionString")
def add_project(req: func.HttpRequest, msg: func.Out[func.QueueMessage], outputDocument: func.Out[func.Document]) -> func.HttpResponse:
    # Add CORS headers
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    
    # Handle preflight requests
    if req.method == "OPTIONS":
        logging.info("Responding to OPTIONS request with CORS headers.")
        return func.HttpResponse(status_code=200, headers=headers)

    logging.info('Python HTTP trigger function is processing a project add')
    try:
        req_body = req.get_json()

        fields = ['title', 'category', 'description','imageUrl','github', 'website']
        for field in fields:
            if field not in req_body:
                logging.warning(f"Missing required field: {field}")
                return func.HttpResponse(
                    f"Missing required field: {field}",
                    status_code = 400,
                    headers=headers
                )
        project = {
            "id": str(datetime.datetime.utcnow().timestamp()),
            "projectsID": str(datetime.datetime.utcnow().timestamp()),
            "title": req_body['title'],
            "category": req_body['category'],
            "description": req_body['description'],
            "imageUrl": req_body['imageUrl'],
            "github": req_body['github'],
            "website": req_body['website'],
            "createdAt": datetime.datetime.utcnow().isoformat()
        }

        outputDocument.set(func.Document.from_dict(project)) # Saves to CosmosDB

        msg.set(json.dumps(project))
        logging.info(f"Successfully added project: {project['title']}")

        return func.HttpResponse(
            json.dumps(project),
            mimetype = "application/json",
            headers=headers,
            status_code = 200
        )
    
    except ValueError as ve:
        logging.error(f"Invalid request body: {str(ve)}")
        return func.HttpResponse(
            "Invalid request body",
            status_code = 400,
            headers=headers
        )
    except Exception as e:
        logging.error(f"Error adding project: {str(e)}")
        return func.HttpResponse(
            "Internal server error",
            status_code=500,
            headers=headers
        )
    

@app.function_name("Delete_Project")
@app.route(route="DeleteProject/{id}", methods=["DELETE"], auth_level = func.AuthLevel.ANONYMOUS)
@app.cosmos_db_input(arg_name="inputDocument",
    database_name="portfolio-db",
    container_name="projects",
    connection="CosmosDbConnectionString",
    id="{id}",
    partition_key="projectsID")
@app.cosmos_db_output(arg_name="outputDocument", 
    database_name="portfolio-db",
    container_name="projects",
    connection="CosmosDbConnectionString")
def delete_project(req: func.HttpRequest, 
                  inputDocument: func.DocumentList,
                  outputDocument: func.Out[func.Document]) -> func.HttpResponse:
    logging.info('Project Deletion HTTP Triggered')

    try:
        # Get project ID from route parameter
        project_id = req.route_params.get('id')
        logging.info(f"Attempting to delete project with ID: {project_id}")

        # Initialize Cosmos DB client
        client = CosmosClient.from_connection_string(os.environ["CosmosDbConnectionString"])
        database = client.get_database_client("portfolio-db")
        container = database.get_container_client("projects")

        # Query for the document first to get its partition key
        query = f"SELECT * FROM c WHERE c.id = '{project_id}'"
        items = list(container.query_items(query=query, enable_cross_partition_query=True))

        if not items:
            return func.HttpResponse(
                "Project not found",
                status_code=404
            )

        # Get the document and its partition key
        document = items[0]
        partition_key = document.get('projectsID', project_id)  # Fallback to id if projectsID not found

        # Delete the document
        container.delete_item(item=document, partition_key=partition_key)

        return func.HttpResponse(
            "Project deleted successfully",
            status_code=200
        )

    except Exception as e:
        logging.error(f"Error deleting project: {str(e)}")
        return func.HttpResponse(
            f"Error deleting project: {str(e)}",
            status_code=500
        )

@app.function_name("Upload_Media")
@app.route(route="UploadMedia", methods=["POST", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def upload_media(req: func.HttpRequest) -> func.HttpResponse:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=headers)

    try:
        # Get file from request
        file_data = req.get_body()
        content_type = req.headers.get('Content-Type')
        file_extension = content_type.split('/')[-1]
        
        # Generate unique filename
        file_name = f"{uuid.uuid4()}.{file_extension}"
        
        # Initialize blob service client
        blob_service_client = BlobServiceClient.from_connection_string(
            os.environ["AzureWebJobsStorage"]
        )
        
        # Get container client - using your existing container name
        container_client = blob_service_client.get_container_client("portfolio-blob-storage")
        
        # Upload file
        blob_client = container_client.upload_blob(
            name=file_name,
            data=file_data,
            content_type=content_type,
            overwrite=True
        )
        
        # Generate URL using your storage account name
        blob_url = f"https://{os.environ['STORAGE_ACCOUNT_NAME']}.blob.core.windows.net/portfolio-blob-storage/{file_name}"
        
        return func.HttpResponse(
            json.dumps({"url": blob_url}),
            mimetype="application/json",
            headers=headers
        )
        
    except Exception as e:
        logging.error(f"Error uploading file: {str(e)}")
        return func.HttpResponse(
            str(e),
            status_code=500,
            headers=headers
        )

@app.function_name("Get_Projects")
@app.route(route="GetProjects", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def get_projects(req: func.HttpRequest) -> func.HttpResponse:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    try:
        # Initialize Cosmos DB client
        client = CosmosClient.from_connection_string(os.environ["CosmosDbConnectionString"])
        database = client.get_database_client("portfolio-db")
        container = database.get_container_client("projects")

        # Query all projects
        query = "SELECT * FROM c"
        items = list(container.query_items(query=query, enable_cross_partition_query=True))

        return func.HttpResponse(
            json.dumps(items),
            mimetype="application/json",
            headers=headers
        )

    except Exception as e:
        logging.error(f"Error getting projects: {str(e)}")
        return func.HttpResponse(
            f"Error getting projects: {str(e)}",
            status_code=500,
            headers=headers
        )

@app.route(route="HttpExample", auth_level=func.AuthLevel.ANONYMOUS)
def HttpExample(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
    

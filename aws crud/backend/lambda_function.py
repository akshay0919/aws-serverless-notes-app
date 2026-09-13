import json
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("note")


def lambda_handler(event, context):

   
    route = event.get("routeKey")

   
    if route == "POST /notes":

        body = json.loads(event.get("body", "{}"))

        title = body.get("title")
        content = body.get("content")

        if not title or not content:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "error": "title and content are required"
                })
            }

        note_id = str(uuid.uuid4())

        note = {
            "noteId": note_id,
            "title": title,
            "content": content
        }

        table.put_item(Item=note)

        return {
            "statusCode": 201,
            "body": json.dumps(note)
        }

    elif route == "GET /notes":

        response = table.scan()

        return {
            "statusCode": 200,
            "body": json.dumps(response["Items"])
        }
        
    elif route == "GET /notes/{id}":

        note_id = event["pathParameters"]["id"]

        response = table.get_item(
            Key={
                "noteId": note_id
            }
        )

        if "Item" not in response:
            return {
                "statusCode": 404,
                "body": json.dumps({
                    "error": "Note not found"
                })
            }

        return {
            "statusCode": 200,
            "body": json.dumps(response["Item"])
        }
        
    elif route == "DELETE /notes/{id}":

        note_id = event["pathParameters"]["id"]

        table.delete_item(
            Key={
                "noteId": note_id
            }
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Note deleted successfully",
                "noteId": note_id
            })
        }

    else:

        return {
            "statusCode": 404,
            "body": json.dumps({
                "error": "Route not found"
            })
        }
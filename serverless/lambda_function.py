import json
import os
from urllib import parse, request

api_endpoint = "https://api.unsplash.com/photos/random"
EXTENSION_ID = "kaeibbjbbioodhkpgclmhdhnoggcikhi"

def lambda_handler(event, context):
    # Allowed origin (Chrome extension's origin or custom header)
    allowed_origin = f"chrome-extension://{EXTENSION_ID}"

    print('event:\n', event)
    print('context:\n', context)

    # Check the request's origin or custom header
    headers = event.get("headers", {})
    request_origin = headers.get("origin", "")
    extension_id = headers.get("x-extension-id", "")

    print("Request Origin:", request_origin)
    print("Extension ID:", extension_id)

    if request_origin != allowed_origin and extension_id != EXTENSION_ID:
        return {
            "statusCode": 403,
            "body": json.dumps({
                "message": "Forbidden: Unauthorized origin",
                "origin": request_origin,
                "extension_id": extension_id
            })
        }

    # Extract user request information
    try:
        request_body = json.loads(event.get("body", "{}"))
        request_params = request_body.get("params", {})
    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request", "error": str(e)})
        }

    # Add API key to the request parameters
    api_key = os.environ.get("UNSPLASH_API_KEY")

    # Add unsplash api key for authentication
    request_params["client_id"] = api_key
    request_params["orientation"] = 'landscape'
    request_params["query"] = 'landscape'
    
    try:
        query_string = parse.urlencode(request_params)
        full_url = f"{api_endpoint}?{query_string}"

        req = request.Request(full_url)
        with request.urlopen(req) as response:
            return {
                "statusCode": response.getcode(),
                "headers": {
                    
                },
                "body": response.read().decode()
            }
        return {
            "statusCode": response.status_code,
            "body": response.text
        }
    except requests.exceptions.RequestException as e:
        return {
            "statusCode": 502,
            "body": json.dumps({"message": "Bad Gateway", "error": str(e)})
        }

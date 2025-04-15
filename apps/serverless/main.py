from flask import make_response
import functions_framework
import json
import os
import requests as fetch
from urllib import parse

api_endpoint = "https://api.unsplash.com/photos/random"
EXTENSION_ID = "kaeibbjbbioodhkpgclmhdhnoggcikhi"
# Allowed origin (Chrome extension's origin or custom header)
ALLOWED_ORIGIN = f"chrome-extension://{EXTENSION_ID}"

@functions_framework.http
def unsplash_function(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response.
    Note:
        For more information on how Flask integrates with Cloud
        Functions, see the `Writing HTTP functions` page.
        https://cloud.google.com/functions/docs/writing/http#http_frameworks
    """

    # Set CORS headers for the preflight request
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "3600",
        }

        return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {"Access-Control-Allow-Origin": "*"}

    # Check the request's origin or custom header
    request_origin = request.headers.get("Origin", "")
    extension_id = request.headers.get("X-Extension-Id", "")

    print("Request Origin:", request_origin)
    print("Extension ID:", extension_id)

    if request_origin != ALLOWED_ORIGIN or extension_id != EXTENSION_ID:
        return ({
            "message": "Forbidden: Unauthorized origin",
            "origin": request_origin,
            "extension_id": extension_id
        }, 403, headers)

    # Extract user request information
    try:
        queryParams = request.args or {}
    except Exception as e:
        return ({"message": "Bad Request", "error": str(e)}, 400, headers)

    # Add API key to the request parameters
    api_key = os.environ.get("UNSPLASH_API_KEY", None)

    if not api_key:
        return ({
            "message": "Bad Request: API key not set, check your environment variables",
        }, 400, headers)

    params = {
        # Add unsplash api key for authentication
        "client_id": api_key,
        "orientation": queryParams.get("orientation", "landscape"),
        "query": queryParams.get("query", "landscape"),
    }
    
    try:
        query_string = parse.urlencode(params)

        res = fetch.get(f"{api_endpoint}?{query_string}")
        if res.status_code != 200:
            return ({
                "message": "Bad Request to Unsplash API",
                "error": res.text
            }, 502, headers)
        return res.json(), res.status_code, headers
    except fetch.RequestException as e:
        return ({"message": "Bad Gateway", "error": str(e)}, 502, headers)

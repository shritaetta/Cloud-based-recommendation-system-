import httpx
from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt

from core.config import settings


app = FastAPI(
    title="API Gateway",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "API Gateway Running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "api-gateway"
    }


async def forward_request(request: Request, target_url: str):
    client = httpx.AsyncClient()

    body = await request.body()

    headers = dict(request.headers)
    
    # Remove hop-by-hop headers and host
    headers.pop("host", None)
    headers.pop("content-length", None)
    headers.pop("connection", None)

    try:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            params=request.query_params
        )

        # Build response excluding potentially conflicting headers
        excluded_headers = [
            "content-encoding", "content-length", 
            "transfer-encoding", "connection"
        ]
        response_headers = {
            k: v for k, v in response.headers.items() 
            if k.lower() not in excluded_headers
        }

        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=response_headers,
            media_type=response.headers.get("content-type")
        )

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Service unavailable: {str(e)}"
        )

    finally:
        await client.aclose()


def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid token"
        )

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )

    except jwt.JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


@app.api_route(
    "/api/users/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"]
)
async def route_user_service(path: str, request: Request):

    public_paths = ["register", "login"]

    if path not in public_paths:
        verify_token(request)

    target_url = f"{settings.user_service_url}/{path}"

    return await forward_request(request, target_url)


@app.api_route(
    "/api/resume/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"]
)
async def route_resume_service(path: str, request: Request):

    verify_token(request)

    target_url = f"{settings.resume_service_url}/api/resume/{path}"

    return await forward_request(request, target_url)


@app.api_route(
    "/api/internships/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"]
)
async def route_internship_service(path: str, request: Request):

    if request.method != "GET":
        verify_token(request)

    target_url = (
        f"{settings.internship_service_url}/api/internships/{path}"
    )

    return await forward_request(request, target_url)
from fastapi import FastAPI, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_v1.api import api_router
import time
import logging

# 配置日志记录
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# 导入Prometheus相关库
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST, REGISTRY

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# 统一错误响应格式
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.status_code,
            "message": exc.detail,
            "detail": exc.detail
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "code": 422,
            "message": "数据验证失败",
            "detail": exc.errors()
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "code": 500,
            "message": "服务器内部错误",
            "detail": str(exc) if settings.SECRET_KEY == "development_secret_key" else "Internal Server Error"
        },
    )

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源，生产环境应限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to AI Novel Agent API"}

# 确保指标只注册一次
# 使用try-except块处理指标重复注册问题
from prometheus_client import Counter, Histogram

# 定义指标变量
NOVEL_REQUEST_COUNT = None
NOVEL_REQUEST_LATENCY = None

# 尝试注册指标，如果已存在则跳过
try:
    # 使用唯一前缀"novel_agent_"避免与其他服务冲突
    NOVEL_REQUEST_COUNT = Counter(
        name="novel_agent_requests_total", 
        documentation="Total HTTP requests for novel agent API", 
        labelnames=["path", "method", "status"]
    )
    NOVEL_REQUEST_LATENCY = Histogram(
        name="novel_agent_request_latency_seconds", 
        documentation="Request latency for novel agent API", 
        labelnames=["path", "method"]
    )
    logger.info("Prometheus metrics registered successfully")
except ValueError as e:
    # 如果指标已存在，捕获异常并从注册表中获取现有指标
    logger.info(f"Metrics already registered: {e}")
    # 从注册表中获取现有指标
    for metric in REGISTRY.collect():  
        if metric.name == "novel_agent_requests_total":
            NOVEL_REQUEST_COUNT = REGISTRY._names_to_collectors["novel_agent_requests_total"]
        elif metric.name == "novel_agent_request_latency_seconds":
            NOVEL_REQUEST_LATENCY = REGISTRY._names_to_collectors["novel_agent_request_latency_seconds"]

@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    latency = time.time() - start
    logger.info(f"Request: {request.method} {request.url.path} - Status: {response.status_code} - Latency: {latency:.4f}s")
    return response

@app.middleware("http")
async def set_utf8_encoding(request: Request, call_next):
    response = await call_next(request)
    # 确保所有JSON响应使用UTF-8编码
    if "application/json" in response.headers.get("Content-Type", ""):
        response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

@app.middleware("http")
async def prometheus_metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    # 计算请求延迟
    latency = time.time() - start_time
    
    # 只有当指标成功注册后才记录
    if NOVEL_REQUEST_COUNT is not None and NOVEL_REQUEST_LATENCY is not None:
        # 记录请求计数和延迟
        NOVEL_REQUEST_COUNT.labels(
            path=request.url.path, 
            method=request.method, 
            status=response.status_code
        ).inc()
        
        NOVEL_REQUEST_LATENCY.labels(
            path=request.url.path, 
            method=request.method
        ).observe(latency)
    
    return response

# 暴露Prometheus指标端点
@app.get("/metrics")
def metrics():
    return Response(generate_latest(REGISTRY), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    import uvicorn
    # 配置uvicorn，排除app.log文件的监控
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_excludes=["app.log"]  # 明确排除日志文件，避免循环监控
    )

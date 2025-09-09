# ================================
# app/core/rate_limiter.py - Rate Limiting
from fastapi import HTTPException, Request
from collections import defaultdict
import time
from typing import Dict
import asyncio


class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = asyncio.Lock()

    async def check_rate_limit(self, request: Request):
        client_ip = request.client.host
        current_time = time.time()

        async with self.lock:
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < 3600
            ]


            requests_last_minute = len([
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < 60
            ])

            requests_last_hour = len(self.requests[client_ip])

            if requests_last_minute > 60:
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded: 60 requests per minute"
                )

            if requests_last_hour > 1000:
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded: 1000 requests per hour"
                )


            self.requests[client_ip].append(current_time)

import requests
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import SessionLocal
from app.models import VisitorLog

from geoip2.database import Reader

geo_reader = Reader("/opt/geoip/GeoLite2-City.mmdb")

class TrackingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        ip = request.headers.get("CF-Connecting-IP") or request.client.host
        db = SessionLocal()
        log = db.query(VisitorLog).filter(VisitorLog.ip == ip).first()

        if not log:
            # Get location using ipapi.co
            country = "Unknown"
            city = "Unknown"

            try:
                # res = requests.get(f"https://ipapi.co/49.47.199.135/json/").json()
                # country = res.get("country_name", "Unknown")
                # city = res.get("city", "Unknown")

                result = geo_reader.city('49.47.199.135')
                print(result)
                country = result.country.name
                city = result.city.name
            except:
                pass

            user_agent = request.headers.get("User-Agent")

            log = VisitorLog(ip=ip, country=country, city=city, user_agent=user_agent)
            db.add(log)
            db.commit()
            db.close()

        response = await call_next(request)
        return response
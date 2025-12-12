import requests
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import SessionLocal
from app.models import VisitorLog
from geoip2.database import Reader
import os
# import platform
# os_type = platform.system()
# print(os_type)
# if os_type == "Linux":
#     geo_reader = Reader("/opt/geoip/GeoLite2-City.mmdb")
# elif os_type == "Windows":
#     geo_reader = Reader("app/geoip/GeoLite2-City.mmdb")

def load_geoip_reader():
    """
    Load GeoIP database safely on Windows, Linux, and Docker.
    Returns None if GeoIP is not available.
    """

    possible_paths = [
        "/opt/geoip/GeoLite2-City.mmdb",           # Linux / Docker path
        "app/geoip/GeoLite2-City.mmdb",            # App folder (Windows & dev)
        "./geoip/GeoLite2-City.mmdb",              # Relative local folder
    ]

    for path in possible_paths:
        if os.path.exists(path):
            try:
                print(f"🌍 Using GeoLite2 database: {path}")
                return Reader(path)
            except Exception as e:
                print(f"⚠ Could not load GeoIP DB at {path}: {e}")

    print("⚠ GeoIP database not found. Geo tracking disabled.")
    return None


geo_reader = load_geoip_reader()

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

                result = geo_reader.city(ip)
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
#!/usr/bin/env python3
"""
IdeaExecutor AI - Production Live Smoke Test CLI Runner
Usage:
    python scripts/run_smoke_test.py --target https://ideaexecutor.onrender.com
    python scripts/run_smoke_test.py --target http://127.0.0.1:8000
"""

import sys
import argparse
import uuid
import requests

def run_smoke_tests(base_url: str):
    base_url = base_url.rstrip("/")
    print(f"\n=======================================================")
    print(f"🚀 Running Production Smoke Test against: {base_url}")
    print(f"=======================================================\n")
    
    session = requests.Session()
    tests_passed = 0
    total_tests = 5

    # 1. Health Probe
    try:
        r = session.get(f"{base_url}/health", timeout=10)
        if r.status_code == 200 and r.json().get("status") == "ok":
            print("✅ 1. GET /health - OK (Service is running)")
            tests_passed += 1
        else:
            print(f"❌ 1. GET /health - Failed with status {r.status_code}: {r.text}")
    except Exception as e:
        print(f"❌ 1. GET /health - Network Error: {e}")

    # 2. Readiness Probe
    try:
        r = session.get(f"{base_url}/readiness", timeout=10)
        if r.status_code == 200:
            data = r.json()
            print(f"✅ 2. GET /readiness - OK (DB: {data.get('database')}, LLM: {data.get('llm_service')})")
            tests_passed += 1
        else:
            print(f"❌ 2. GET /readiness - Failed with status {r.status_code}: {r.text}")
    except Exception as e:
        print(f"❌ 2. GET /readiness - Network Error: {e}")

    # 3. User Registration Flow
    unique_id = uuid.uuid4().hex[:6]
    test_email = f"beta_smoke_{unique_id}@example.com"
    test_password = "SmokeTestSecret123!"
    token = None

    try:
        r = session.post(f"{base_url}/auth/register", json={
            "name": f"Founder {unique_id}",
            "email": test_email,
            "password": test_password
        }, timeout=10)
        if r.status_code == 200 and "access_token" in r.json():
            token = r.json()["access_token"]
            print(f"✅ 3. POST /auth/register - OK (Issued JWT token)")
            tests_passed += 1
        else:
            print(f"❌ 3. POST /auth/register - Failed with status {r.status_code}: {r.text}")
    except Exception as e:
        print(f"❌ 3. POST /auth/register - Network Error: {e}")

    # 4. Authenticated Endpoint Check
    if token:
        headers = {"Authorization": f"Bearer {token}"}
        try:
            r = session.get(f"{base_url}/auth/me", headers=headers, timeout=10)
            if r.status_code == 200 and r.json().get("email") == test_email:
                print("✅ 4. GET /auth/me - OK (User isolation and JWT verified)")
                tests_passed += 1
            else:
                print(f"❌ 4. GET /auth/me - Failed with status {r.status_code}: {r.text}")
        except Exception as e:
            print(f"❌ 4. GET /auth/me - Network Error: {e}")

        # 5. PMF / Beta Feedback Route Check
        try:
            r = session.get(f"{base_url}/pmf/metrics", headers=headers, timeout=10)
            if r.status_code == 200 and "pmf_signal" in r.json():
                print(f"✅ 5. GET /pmf/metrics - OK (PMF Engine Signal: {r.json().get('pmf_signal')})")
                tests_passed += 1
            else:
                print(f"❌ 5. GET /pmf/metrics - Failed with status {r.status_code}: {r.text}")
        except Exception as e:
            print(f"❌ 5. GET /pmf/metrics - Network Error: {e}")
    else:
        print("⚠️ Skipping authenticated tests due to register step failure.")

    print(f"\n=======================================================")
    print(f"📊 Results: {tests_passed}/{total_tests} Smoke Tests Passed")
    print(f"=======================================================\n")
    return tests_passed == total_tests

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="IdeaExecutor AI Production Smoke Test Runner")
    parser.add_argument("--target", default="http://127.0.0.1:8000", help="Target base URL of backend API")
    args = parser.parse_args()
    success = run_smoke_tests(args.target)
    sys.exit(0 if success else 1)

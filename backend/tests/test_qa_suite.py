import sys
import os
import time
import uuid
import json
import asyncio
import httpx

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, init_db

def log_section(title):
    print(f"\n==================================================")
    print(f"=== {title.upper()} ===")
    print(f"==================================================")

async def run_qa_suite():
    init_db()

    results = {
        "passed": 0,
        "failed": 0,
        "benchmarks": {},
        "edge_cases": {},
        "modules_tested": []
    }

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        
        # ----------------------------------------------------
        # 1. AUTHENTICATION & SECURITY TESTS
        # ----------------------------------------------------
        log_section("1. Authentication & Security Tests")
        
        test_email = f"qa_user_{uuid.uuid4().hex[:8]}@example.com"
        test_pass = "SecurePass123!"

        # 1.1 Registration
        t0 = time.time()
        res = await client.post("/auth/register", json={
            "email": test_email,
            "password": test_pass,
            "name": "QA Tester"
        })
        t_reg = round((time.time() - t0) * 1000, 2)
        results["benchmarks"]["register_ms"] = t_reg
        
        if res.status_code in [200, 201]:
            print(f"[PASS] Registration successful ({t_reg}ms)")
            results["passed"] += 1
        else:
            print(f"[FAIL] Registration failed ({res.status_code}): {res.text}")
            results["failed"] += 1

        # 1.2 Login
        t0 = time.time()
        res = await client.post("/auth/login", json={
            "email": test_email,
            "password": test_pass
        })
        t_login = round((time.time() - t0) * 1000, 2)
        results["benchmarks"]["login_ms"] = t_login

        if res.status_code == 200:
            token = res.json().get("access_token")
            print(f"[PASS] Login successful ({t_login}ms) - Token acquired")
            results["passed"] += 1
        else:
            print(f"[FAIL] Login failed ({res.status_code}): {res.text}")
            results["failed"] += 1
            return results

        headers = {"Authorization": f"Bearer {token}"}

        # 1.3 Profile Check
        res = await client.get("/auth/me", headers=headers)
        if res.status_code == 200 and res.json().get("email") == test_email:
            print("[PASS] Profile auth/me verified successfully")
            results["passed"] += 1
        else:
            print(f"[FAIL] Profile verification failed: {res.status_code}")
            results["failed"] += 1

        # 1.4 Invalid Token Rejection
        res_bad = await client.get("/auth/me", headers={"Authorization": "Bearer invalid_token_123"})
        if res_bad.status_code in [401, 403]:
            print("[PASS] Invalid token rejected correctly (401/403)")
            results["passed"] += 1
        else:
            print(f"[FAIL] Invalid token security flaw ({res_bad.status_code})")
            results["failed"] += 1

        # ----------------------------------------------------
        # 2. DOMAIN AGENT PIPELINE & WORKFLOW TESTING
        # ----------------------------------------------------
        log_section("2. Multi-Agent Analysis & Workflow Testing")
        
        ideas_to_test = [
            "AI Co-founder platform for early-stage entrepreneurs",
            "Autonomous drone delivery for rural medical supplies",
            "Decentralized B2B marketplace for carbon offset credits"
        ]

        analysis_ids = []

        for idx, idea in enumerate(ideas_to_test):
            print(f"\n--- Testing Startup Concept {idx+1}: '{idea}' ---")
            t0 = time.time()
            res = await client.post("/analyze", json={"idea": idea}, headers=headers)
            t_analyze = round((time.time() - t0) * 1000, 2)
            
            if res.status_code == 200:
                resp_json = res.json()
                data = resp_json.get("data", {})
                analysis_id = resp_json.get("analysisId")
                if analysis_id:
                    analysis_ids.append(analysis_id)
                
                # Verify required domain keys
                expected_keys = [
                    "market", "competitors", "swot", "business_model", "mvp", 
                    "revenue", "score", "pitch", "brand", "tech_stack", "sales", 
                    "hiring", "growth", "health_score", "risk_meter", "positioning_matrix"
                ]
                missing_keys = [k for k in expected_keys if k not in data]
                
                if not missing_keys:
                    print(f"[PASS] Analysis completed in {t_analyze}ms - All 16 domain keys present")
                    results["passed"] += 1
                else:
                    print(f"[FAIL] Analysis response missing keys: {missing_keys}")
                    results["failed"] += 1
            else:
                print(f"[FAIL] Analysis endpoint failed ({res.status_code}): {res.text}")
                results["failed"] += 1

        # ----------------------------------------------------
        # 3. DATA PERSISTENCE & HISTORY RELOAD
        # ----------------------------------------------------
        log_section("3. Data Persistence & History Verification")

        res = await client.get("/history", headers=headers)
        if res.status_code == 200:
            history = res.json().get("data", [])
            print(f"[PASS] History fetched successfully ({len(history)} records found)")
            if len(history) >= len(ideas_to_test):
                print("[PASS] Analysis history persistence verified")
                results["passed"] += 1
            else:
                print(f"[FAIL] History record count mismatch (expected >={len(ideas_to_test)}, got {len(history)})")
                results["failed"] += 1
        else:
            print(f"[FAIL] History fetch failed: {res.status_code}")
            results["failed"] += 1

        # ----------------------------------------------------
        # 4. REPORT GENERATION & EXPORTS
        # ----------------------------------------------------
        log_section("4. PDF & PPTX Report Exports")

        if analysis_ids:
            target_id = analysis_ids[0]
            
            # PDF Report
            t0 = time.time()
            res = await client.get("/download/pdf", params={"analysisId": target_id}, headers=headers)
            t_pdf = round((time.time() - t0) * 1000, 2)
            results["benchmarks"]["pdf_gen_ms"] = t_pdf

            if res.status_code in [200, 201] or len(res.content) > 100:
                print(f"[PASS] PDF Report generated in {t_pdf}ms ({len(res.content)} bytes)")
                results["passed"] += 1
            else:
                print(f"[FAIL] PDF Report endpoint failed: {res.status_code}")
                results["failed"] += 1

            # PPTX Report
            t0 = time.time()
            res = await client.get("/download/pptx", params={"analysisId": target_id}, headers=headers)
            t_pptx = round((time.time() - t0) * 1000, 2)
            results["benchmarks"]["pptx_gen_ms"] = t_pptx

            if res.status_code in [200, 201] or len(res.content) > 100:
                print(f"[PASS] PPTX Report generated in {t_pptx}ms ({len(res.content)} bytes)")
                results["passed"] += 1
            else:
                print(f"[FAIL] PPTX Report endpoint failed: {res.status_code}")
                results["failed"] += 1

        # ----------------------------------------------------
        # 5. EDGE CASE & FUZZ TESTING
        # ----------------------------------------------------
        log_section("5. Edge Case & Fuzzing Tests")

        fuzz_payloads = [
            ("Empty String", ""),
            ("Single Word", "AI"),
            ("Long Text", "A " * 1000),
            ("Emojis & Symbols", "Startup Automation #1"),
            ("XSS Script Injection", "<script>alert('xss')</script>"),
            ("SQL Injection Payload", "' OR 1=1 -- UNION SELECT * FROM users")
        ]

        for label, payload in fuzz_payloads:
            t0 = time.time()
            res = await client.post("/analyze", json={"idea": payload}, headers=headers)
            t_fuzz = round((time.time() - t0) * 1000, 2)

            if res.status_code == 200:
                print(f"[PASS] Handled '{label}' gracefully in {t_fuzz}ms (Status 200)")
                results["passed"] += 1
                results["edge_cases"][label] = "Handled (200)"
                results["benchmarks"][f"fuzz_{label}_ms"] = t_fuzz
            elif res.status_code in [400, 422]:
                print(f"[PASS] Rejected '{label}' safely in {t_fuzz}ms (Status {res.status_code})")
                results["passed"] += 1
                results["edge_cases"][label] = f"Rejected Safely ({res.status_code})"
                results["benchmarks"][f"fuzz_{label}_ms"] = t_fuzz
            else:
                print(f"[FAIL] Unhandled server crash for '{label}' (Status {res.status_code})")
                results["failed"] += 1
                results["edge_cases"][label] = f"Server Error ({res.status_code})"

        log_section("QA Verification Summary")
        print(f"Total Passed: {results['passed']}")
        print(f"Total Failed: {results['failed']}")
        print(f"Benchmarks: {json.dumps(results['benchmarks'], indent=2)}")

        return results

if __name__ == "__main__":
    asyncio.run(run_qa_suite())

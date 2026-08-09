import sys
import os
import time
import uuid
import json
import asyncio
import httpx

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, init_db

def log_section(title):
    print(f"\n==================================================")
    print(f"=== {title.upper()} ===")
    print(f"==================================================")

async def run_button_and_ai_tests():
    init_db()

    results = {
        "buttons_tested": 0,
        "buttons_passed": 0,
        "ai_queries_tested": 0,
        "ai_queries_passed": 0,
    }

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:

        # ----------------------------------------------------
        # 1. AUTH & SETUP
        # ----------------------------------------------------
        email = f"button_tester_{uuid.uuid4().hex[:8]}@example.com"
        password = "SecurePass123!"
        await client.post("/auth/register", json={"email": email, "password": password, "name": "Button Tester"})
        res_login = await client.post("/auth/login", json={"email": email, "password": password})
        token = res_login.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}

        # ----------------------------------------------------
        # 2. INTERACTIVE FEATURE BUTTONS TESTING
        # ----------------------------------------------------
        log_section("1. Testing Interactive Feature Buttons & API Triggers")

        buttons_to_test = [
            ("Analyze / Regenerate Idea Button", "POST", "/analyze", {"idea": "Autonomous AI Sales Agent"}),
            ("Devil's Advocate Challenge Button", "POST", "/devils-advocate", {"idea": "Autonomous AI Sales Agent"}),
            ("Execution Score Calculator Button", "POST", "/execution-score", {
                "idea": "Autonomous AI Sales Agent", 
                "team_skills": ["Python", "AI", "Sales"], 
                "budget": 50000, 
                "timeline": 6
            }),
            ("Roleplay Simulator Chat Button", "POST", "/simulator/chat", {
                "idea": "Autonomous AI Sales Agent",
                "simulator_type": "investor",
                "persona": "Silicon Valley VC",
                "message": "What is your defensible moat and CAC payback period?",
                "chat_history": []
            }),
            ("Simulator Evaluation Button", "POST", "/simulator/evaluate", {
                "idea": "Autonomous AI Sales Agent",
                "simulator_type": "investor",
                "persona": "Silicon Valley VC",
                "chat_history": [{"sender": "user", "text": "Our moat is proprietary workflow data."}]
            }),
            ("Document List Button", "GET", "/documents", {}),
            ("Voice Studio Synthesis Button", "POST", "/get-voice-guidance", {
                "page": "dashboard",
                "text": "Welcome to IdeaExecutor, your autonomous co-founder."
            }),
            ("Workspace List Endpoint", "GET", "/workspaces", {}),
            ("Push Notifications List Endpoint", "GET", "/notifications", {}),
            ("Send Push Notification Endpoint", "POST", "/notifications/push", {
                "title": "Test Push Alert",
                "message": "Real-time AI execution completed",
                "type": "success"
            }),
        ]


        for btn_name, method, endpoint, payload in buttons_to_test:
            t0 = time.time()
            if method == "POST":
                res = await client.post(endpoint, json=payload, headers=headers)
            else:
                res = await client.get(endpoint, headers=headers)
            t_ms = round((time.time() - t0) * 1000, 2)

            results["buttons_tested"] += 1
            if res.status_code in [200, 201]:
                print(f"[PASS] {btn_name} -> Endpoint {endpoint} returned 200 OK ({t_ms}ms)")
                results["buttons_passed"] += 1
            else:
                print(f"[FAIL] {btn_name} -> Endpoint {endpoint} failed ({res.status_code}): {res.text}")

        # PDF & PPTX Buttons
        res_an = await client.post("/analyze", json={"idea": "Test Startup Idea"}, headers=headers)
        an_id = res_an.json().get("analysisId", 1)

        t0 = time.time()
        res_pdf = await client.get("/download/pdf", params={"analysisId": an_id}, headers=headers)
        results["buttons_tested"] += 1
        if res_pdf.status_code in [200, 201]:
            print(f"[PASS] PDF Export Button -> Returned {len(res_pdf.content)} bytes ({round((time.time()-t0)*1000, 2)}ms)")
            results["buttons_passed"] += 1

        t0 = time.time()
        res_pptx = await client.get("/download/pptx", params={"analysisId": an_id}, headers=headers)
        results["buttons_tested"] += 1
        if res_pptx.status_code in [200, 201]:
            print(f"[PASS] PPTX Deck Export Button -> Returned {len(res_pptx.content)} bytes ({round((time.time()-t0)*1000, 2)}ms)")
            results["buttons_passed"] += 1

        # ----------------------------------------------------
        # 3. AI SOLUTION QUALITY & USER PROMPT RESPONSIVENESS
        # ----------------------------------------------------
        log_section("2. AI Solution Quality & User Prompt Responsiveness")

        user_queries = [
            (
                "Growth CAC Reduction", 
                "How do I lower CAC from $150 to $40 for an AI SaaS startup?",
                ["cac", "conversion", "referral", "channel", "strategy"]
            ),
            (
                "Cold Email Generation", 
                "Write a high-converting cold email template targeting Enterprise CFOs",
                ["hi", "cfo", "demo", "cost", "regards"]
            ),
            (
                "Strategic B2B Pivot", 
                "How can my startup pivot from B2C to B2B enterprise sales?",
                ["b2b", "sales", "enterprise", "pipeline", "contract"]
            ),
            (
                "High-Scale Architecture", 
                "What is the recommended cloud architecture and database setup for 1 Million DAU?",
                ["database", "cache", "scalable", "architecture", "redis"]
            )
        ]

        for q_label, prompt, expected_words in user_queries:
            t0 = time.time()
            res = await client.post("/analyze", json={"idea": prompt}, headers=headers)
            t_ms = round((time.time() - t0) * 1000, 2)
            results["ai_queries_tested"] += 1

            if res.status_code == 200:
                resp_text = json.dumps(res.json().get("data", {})).lower()
                matches = [w for w in expected_words if w in resp_text]
                has_solutions = len(resp_text) > 200
                
                if has_solutions:
                    print(f"[PASS] Query '{q_label}': AI generated structured solution in {t_ms}ms (Keyword alignment: {len(matches)}/{len(expected_words)})")
                    results["ai_queries_passed"] += 1
                else:
                    print(f"[FAIL] Query '{q_label}': AI generated empty or insufficient solution")
            else:
                print(f"[FAIL] Query '{q_label}': Endpoint returned status {res.status_code}")

    log_section("Verification Summary")
    print(f"Feature Buttons Tested: {results['buttons_passed']}/{results['buttons_tested']} Passed")
    print(f"AI User Prompt Solutions Tested: {results['ai_queries_passed']}/{results['ai_queries_tested']} Passed")

    return results

if __name__ == "__main__":
    asyncio.run(run_button_and_ai_tests())

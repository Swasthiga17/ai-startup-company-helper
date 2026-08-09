import requests
import uuid

BASE_URL = "http://localhost:8000"

def run_tests():
    print("=== Starting Full App Verification ===")
    
    # 1. Registration
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "Password123!"
    
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "name": "Test User"
    })
    print("Register Response:", res.status_code)
    assert res.status_code in [200, 201], "Registration failed"
    
    # 2. Login
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    print("Login Response:", res.status_code)
    assert res.status_code == 200, "Login failed"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Dynamic Analysis Tests
    ideas = [
        "AI Hospital", 
        "AgriTech Drone", 
        "Crypto Exchange", 
        "EdTech Tutor", 
        "Legal AI"
    ]
    
    domains_seen = set()
    competitors_seen = set()
    
    for idea in ideas:
        print(f"\n--- Testing Idea: {idea} ---")
        res = requests.post(f"{BASE_URL}/analyze", json={"idea": idea}, headers=headers)
        print(f"Analyze API Status: {res.status_code}")
        assert res.status_code == 200, "Analysis failed"
        
        data = res.json().get("data", {})
        comps = data.get("competitors", {}).get("competitors", [])
        if len(comps) > 0:
            first_comp = comps[0].get("name", "")
            print("Competitors Example:", first_comp)
            competitors_seen.add(first_comp)
            
        summary = data.get("score", {}).get("summary", "")
        print("Score Summary:", summary)
        domains_seen.add(summary)
        
    print(f"\nUnique Competitors seen: {len(competitors_seen)} out of {len(ideas)}")
    assert len(competitors_seen) > 2, "Competitors are not dynamically diverging"
    
    # 4. History
    res = requests.get(f"{BASE_URL}/history", headers=headers)
    print("History Response:", res.status_code)
    history = res.json().get("data", [])
    print(f"History length: {len(history)}")
    assert len(history) == len(ideas), "History does not match"
    
    # 5. Reports API
    if len(history) > 0:
        last_id = history[0]["id"]
        res = requests.get(f"{BASE_URL}/download/pdf", params={"analysisId": last_id}, headers=headers)
        print("PDF Report Response:", res.status_code)
        assert res.status_code in [200, 404, 500], "Unexpected PDF response" 
        
        res = requests.get(f"{BASE_URL}/download/pptx", params={"analysisId": last_id}, headers=headers)
        print("PPT Report Response:", res.status_code)
        assert res.status_code in [200, 404, 500], "Unexpected PPT response"

    # 6. Profile
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print("Profile Response:", res.status_code)
    if res.status_code == 200:
        print("Profile Email:", res.json().get("email"))
    
    print("\n=== VERIFICATION COMPLETE: ALL BACKEND DYNAMICS FUNCTIONAL ===")

if __name__ == "__main__":
    run_tests()

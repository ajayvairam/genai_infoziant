import sys
import os

# Fix Windows console UTF-8 printing
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    print("Health response:", response.status_code, response.json())
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_and_flow():
    # 1. Analyze an error
    analyze_payload = {
        "error_message": "Traceback (most recent call last):\n  File 'main.py', line 2\n    return price + x\nNameError: name 'x' is not defined",
        "language": "Python",
        "source_code": "def calculate(price):\n    return price + x\n\ncalculate(10)",
        "category": "Runtime Exception"
    }
    
    headers = {"Authorization": "Bearer test-user-token-123"}
    response = client.post("/api/debug/analyze", json=analyze_payload, headers=headers)
    print("Analyze response status:", response.status_code)
    assert response.status_code == 200
    data = response.json()
    assert "diagnosis" in data
    assert "summary" in data["diagnosis"]
    assert "root_cause" in data["diagnosis"]
    assert "steps_to_fix" in data["diagnosis"]
    assert "corrected_code" in data
    analysis_id = data["id"]
    print("Diagnosis Title:", data.get("title"))
    print("Summary:", data["diagnosis"]["summary"][:80])
    print("Steps count:", len(data["diagnosis"]["steps_to_fix"]))

    # 2. Ask follow-up question
    chat_payload = {
        "analysis_id": analysis_id,
        "message": "Why did this error occur and can you explain the fix?",
        "error_context": {
            "language": "Python",
            "error_message": analyze_payload["error_message"],
            "summary": data["diagnosis"]["summary"],
            "root_cause": data["diagnosis"]["root_cause"],
            "source_code": analyze_payload["source_code"],
            "corrected_code": data["corrected_code"]
        }
    }
    chat_res = client.post("/api/debug/chat", json=chat_payload, headers=headers)
    print("Chat response status:", chat_res.status_code)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "reply" in chat_data
    print("Chat reply preview:", repr(chat_data["reply"][:80]))

    # 3. Get history
    hist_res = client.get("/api/debug/history", headers=headers)
    print("History status:", hist_res.status_code)
    assert hist_res.status_code == 200
    items = hist_res.json()
    assert len(items) >= 1
    assert items[0]["id"] == analysis_id
    print("History records found:", len(items))

    # 4. Get dashboard stats
    dash_res = client.get("/api/dashboard/stats", headers=headers)
    print("Dashboard stats status:", dash_res.status_code)
    assert dash_res.status_code == 200
    stats = dash_res.json()
    assert stats["total_analyses"] >= 1
    assert len(stats["top_languages"]) >= 1
    print("Total analyses:", stats["total_analyses"])
    print("Top language:", stats["top_languages"][0]["language"])

    # 5. Delete record
    del_res = client.delete(f"/api/debug/history/{analysis_id}", headers=headers)
    print("Delete status:", del_res.status_code)
    assert del_res.status_code == 200

    # 6. Verify deleted
    get_del = client.get(f"/api/debug/history/{analysis_id}", headers=headers)
    assert get_del.status_code == 404
    print("Verified item 404 after deletion.")

if __name__ == "__main__":
    print("Running DebugMate AI Backend Tests...")
    test_health()
    test_analyze_and_flow()
    print("ALL TESTS PASSED SUCCESSFULLY! ✅")

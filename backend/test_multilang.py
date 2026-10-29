import sys
import os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_multilanguage_samples():
    languages = [
        {
            "language": "JavaScript",
            "error_message": "Uncaught TypeError: Cannot read properties of undefined (reading 'map')\n    at renderList (app.js:5)",
            "source_code": "function renderList(res) { return res.data.users.map(u => u.name); }",
            "category": "Runtime Error"
        },
        {
            "language": "Java",
            "error_message": "Exception in thread 'main' java.lang.NullPointerException: Cannot invoke 'String.length()' because 's' is null",
            "source_code": "String s = null; System.out.println(s.length());",
            "category": "Runtime Error"
        },
        {
            "language": "SQL",
            "error_message": "ERROR 1064 (42000): You have an error in your SQL syntax near 'FORM users'",
            "source_code": "SELECT * FORM users WHERE active = 1;",
            "category": "Syntax Error"
        }
    ]

    for sample in languages:
        res = client.post("/api/debug/analyze", json=sample, headers={"Authorization": "Bearer multi-lang-test"})
        assert res.status_code == 200
        data = res.json()
        print(f"[{sample['language']}] Title: {data['title']}")
        assert len(data["diagnosis"]["steps_to_fix"]) > 0

    print("Multi-language samples test passed! ✅")

if __name__ == "__main__":
    test_multilanguage_samples()


"""
AI Verification Module (Optional)
Uses Google Gemini to evaluate proof of completion.
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


async def verify_proof(task_description: str, proof_url: str) -> dict:
    """
    Use Google Gemini to evaluate whether the proof satisfies the task.
    Returns: { score: float, verdict: "PASS"|"FAIL", reasoning: str }
    """
    if not GEMINI_API_KEY:
        return {
            "score": 0.85,
            "verdict": "PASS",
            "reasoning": "Demo mode — AI verification simulated. Score: 85%."
        }

    try:
        import httpx

        prompt = f"""You are a task verification AI for a decentralized bounty platform.

TASK DESCRIPTION:
{task_description}

PROOF OF COMPLETION:
{proof_url}

Evaluate whether the submitted proof satisfactorily completes the task.
Consider:
1. Completeness — Does the proof cover all requirements?
2. Quality — Is the work quality acceptable?
3. Authenticity — Does the proof appear genuine?

Respond in JSON format ONLY:
{{
  "score": <0.0 to 1.0>,
  "verdict": "PASS" or "FAIL",
  "reasoning": "<brief explanation>"
}}

A score >= 0.7 should be a PASS.
"""

        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                api_url,
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [
                        {
                            "parts": [
                                {"text": prompt}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": 300,
                        "responseMimeType": "application/json",
                    }
                },
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                # Gemini response structure
                content = data["candidates"][0]["content"]["parts"][0]["text"]

                # Parse JSON from response
                result = json.loads(content)
                return {
                    "score": float(result.get("score", 0)),
                    "verdict": result.get("verdict", "FAIL"),
                    "reasoning": result.get("reasoning", "No reasoning provided")
                }
            else:
                error_msg = response.text[:200]
                return {
                    "score": 0,
                    "verdict": "FAIL",
                    "reasoning": f"Gemini API error ({response.status_code}): {error_msg}"
                }

    except json.JSONDecodeError as e:
        return {
            "score": 0,
            "verdict": "FAIL",
            "reasoning": f"Failed to parse Gemini response as JSON: {str(e)}"
        }
    except Exception as e:
        return {
            "score": 0,
            "verdict": "FAIL",
            "reasoning": f"AI verification failed: {str(e)}"
        }

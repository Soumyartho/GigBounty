"""
AI Verification Module (Optional)
Uses Groq LLaMA to evaluate proof of completion.
"""

import os
import json
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


async def verify_proof(task_description: str, proof_url: str) -> dict:
    """
    Use Groq LLaMA to evaluate whether the proof satisfies the task.
    Returns: { score: float, verdict: "PASS"|"FAIL", reasoning: str }
    """
    if not GROQ_API_KEY:
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

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a task verification AI. Respond only in valid JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 300
                },
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]

                # Parse JSON from response
                result = json.loads(content)
                return {
                    "score": float(result.get("score", 0)),
                    "verdict": result.get("verdict", "FAIL"),
                    "reasoning": result.get("reasoning", "No reasoning provided")
                }
            else:
                return {
                    "score": 0,
                    "verdict": "FAIL",
                    "reasoning": f"AI service error: {response.status_code}"
                }

    except Exception as e:
        return {
            "score": 0,
            "verdict": "FAIL",
            "reasoning": f"AI verification failed: {str(e)}"
        }

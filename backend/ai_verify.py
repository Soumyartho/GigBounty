"""
AI Verification Module
Uses Google Gemini to evaluate proof of completion.
For GitHub URLs: fetches repo metadata, README, and file tree first.
"""

import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


def _parse_github_url(url: str) -> tuple:
    """Extract owner/repo from a GitHub URL. Returns (owner, repo) or (None, None)."""
    url = url.strip().rstrip("/").replace(".git", "")
    patterns = [
        r"github\.com/([^/]+)/([^/]+)",
        r"github\.com/([^/]+)/([^/?#]+)",
    ]
    for pat in patterns:
        m = re.search(pat, url)
        if m:
            return m.group(1), m.group(2)
    return None, None


async def _fetch_github_context(owner: str, repo: str) -> str:
    """Fetch repo info, README, file tree, and languages from GitHub API."""
    import httpx

    context_parts = []
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "GigBounty-AI"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        # 1. Repo info
        try:
            resp = await client.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                context_parts.append(f"REPO: {data.get('full_name', '')}")
                context_parts.append(f"DESCRIPTION: {data.get('description', 'No description')}")
                context_parts.append(f"LANGUAGE: {data.get('language', 'Unknown')}")
                context_parts.append(f"STARS: {data.get('stargazers_count', 0)} | FORKS: {data.get('forks_count', 0)}")
                context_parts.append(f"CREATED: {data.get('created_at', '')} | UPDATED: {data.get('updated_at', '')}")
                context_parts.append(f"SIZE: {data.get('size', 0)} KB")
                topics = data.get("topics", [])
                if topics:
                    context_parts.append(f"TOPICS: {', '.join(topics)}")
        except Exception:
            pass

        # 2. Languages
        try:
            resp = await client.get(f"https://api.github.com/repos/{owner}/{repo}/languages", headers=headers)
            if resp.status_code == 200:
                langs = resp.json()
                if langs:
                    total = sum(langs.values())
                    lang_str = ", ".join(f"{k}: {v/total*100:.1f}%" for k, v in sorted(langs.items(), key=lambda x: -x[1]))
                    context_parts.append(f"LANGUAGE BREAKDOWN: {lang_str}")
        except Exception:
            pass

        # 3. File tree (top-level + one level deep)
        try:
            resp = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1",
                headers=headers
            )
            if resp.status_code != 200:
                # Try 'master' branch
                resp = await client.get(
                    f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1",
                    headers=headers
                )
            if resp.status_code == 200:
                tree = resp.json().get("tree", [])
                # Show first 80 files
                file_list = [f"  {'📁' if t['type'] == 'tree' else '📄'} {t['path']}" for t in tree[:80]]
                context_parts.append(f"FILE TREE ({len(tree)} total files):\n" + "\n".join(file_list))
                if len(tree) > 80:
                    context_parts.append(f"  ... and {len(tree) - 80} more files")
        except Exception:
            pass

        # 4. README
        try:
            resp = await client.get(f"https://api.github.com/repos/{owner}/{repo}/readme", headers=headers)
            if resp.status_code == 200:
                import base64
                content = resp.json().get("content", "")
                try:
                    readme_text = base64.b64decode(content).decode("utf-8", errors="replace")
                    # Truncate to ~3000 chars
                    if len(readme_text) > 3000:
                        readme_text = readme_text[:3000] + "\n... [TRUNCATED]"
                    context_parts.append(f"README:\n{readme_text}")
                except Exception:
                    pass
        except Exception:
            pass

    return "\n\n".join(context_parts) if context_parts else "Could not fetch repository data."


async def verify_proof(task_description: str, proof_url: str) -> dict:
    """
    Use Google Gemini to evaluate whether the proof satisfies the task.
    For GitHub URLs: fetches real repo content first.
    Returns: { score: float, verdict: "PASS"|"FAIL", reasoning: str, audit_report: str }
    """
    if not GEMINI_API_KEY:
        return {
            "score": 0.85,
            "verdict": "PASS",
            "reasoning": "Demo mode — AI verification simulated. Score: 85%.",
            "audit_report": "Demo mode — no real audit performed."
        }

    try:
        import httpx

        # If GitHub URL, fetch real repo content
        github_context = ""
        owner, repo = _parse_github_url(proof_url)
        if owner and repo:
            github_context = await _fetch_github_context(owner, repo)

        # Build prompt
        if github_context:
            proof_section = f"""PROOF OF COMPLETION (GitHub Repository):
URL: {proof_url}

--- FETCHED REPOSITORY DATA ---
{github_context}
--- END REPOSITORY DATA ---"""
        else:
            proof_section = f"""PROOF OF COMPLETION:
{proof_url}"""

        prompt = f"""You are a task verification AI and code auditor for a decentralized bounty platform (GigBounty).

TASK DESCRIPTION:
{task_description}

{proof_section}

Perform a thorough evaluation:

1. **Completeness** — Does the repository/proof cover ALL requirements from the task description?
2. **Code Quality** — Is the code well-structured, readable, and maintainable? Look at file organization, naming, and patterns.
3. **Technical Implementation** — Review the tech stack, dependencies, architecture. Are there any red flags?
4. **Security** — Any obvious security issues (hardcoded secrets, missing input validation, etc.)?
5. **Documentation** — Does the README explain setup, usage, and features adequately?

Respond in JSON format ONLY:
{{
  "score": <0.0 to 1.0>,
  "verdict": "PASS" or "FAIL",
  "reasoning": "<2-3 sentence summary>",
  "audit_report": "<detailed markdown audit report with sections for Completeness, Code Quality, Architecture, Security, Documentation. Use bullet points. Be specific about files and patterns you found.>"
}}

A score >= 0.7 should be a PASS. Be fair but thorough.
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
                        "maxOutputTokens": 2000,
                        "responseMimeType": "application/json",
                    }
                },
                timeout=45.0
            )

            if response.status_code == 200:
                data = response.json()
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                result = json.loads(content)
                return {
                    "score": float(result.get("score", 0)),
                    "verdict": result.get("verdict", "FAIL"),
                    "reasoning": result.get("reasoning", "No reasoning provided"),
                    "audit_report": result.get("audit_report", "No audit report generated.")
                }
            else:
                error_msg = response.text[:300]
                return {
                    "score": 0,
                    "verdict": "FAIL",
                    "reasoning": f"Gemini API error ({response.status_code}): {error_msg}",
                    "audit_report": ""
                }

    except json.JSONDecodeError as e:
        return {
            "score": 0,
            "verdict": "FAIL",
            "reasoning": f"Failed to parse Gemini response as JSON: {str(e)}",
            "audit_report": ""
        }
    except Exception as e:
        return {
            "score": 0,
            "verdict": "FAIL",
            "reasoning": f"AI verification failed: {str(e)}",
            "audit_report": ""
        }

import os
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq

async def debug_groq():
    load_dotenv()
    api_key = os.getenv("GROQ_API_KEY")
    print(f"API Key: {api_key[:10]}...{api_key[-5:] if api_key else 'None'}")
    
    if not api_key:
        print("Error: No API key found in .env")
        return

    client = AsyncGroq(api_key=api_key)
    print("Testing Groq API with llama-3.3-70b-versatile...")
    
    try:
        # Use a very short timeout for testing
        chat_completion = await asyncio.wait_for(
            client.chat.completions.create(
                messages=[{"role": "user", "content": "Say hello"}],
                model="llama-3.3-70b-versatile",
            ),
            timeout=10.0
        )
        print("Success!")
        print(f"Response: {chat_completion.choices[0].message.content}")
    except asyncio.TimeoutError:
        print("Error: Request timed out after 10 seconds.")
    except Exception as e:
        print(f"Caught Exception: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(debug_groq())

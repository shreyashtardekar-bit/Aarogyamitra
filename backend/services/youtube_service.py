import os
from googleapiclient.discovery import build
from typing import List, Dict, Any

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

def get_youtube_client():
    if not YOUTUBE_API_KEY or YOUTUBE_API_KEY == "your-youtube-api-key":
        return None
    try:
        return build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    except Exception as e:
        print(f"Failed to build YouTube client: {e}")
        return None

def search_exercise_videos(query: str, max_results: int = 3) -> List[Dict[str, Any]]:
    """Search YouTube for exercise demonstration videos"""
    youtube = get_youtube_client()
    if not youtube:
        # Fallback to a placeholder or generic search link if API key is not set
        return []
        
    try:
        # Append terms to get better workout demonstration results
        search_query = f"{query} exercise demonstration form"
        
        request = youtube.search().list(
            part="snippet",
            maxResults=max_results,
            q=search_query,
            type="video",
            videoDuration="short" # Prefer shorter demonstration videos
        )
        response = request.execute()
        
        videos = []
        for item in response.get("items", []):
            videos.append({
                "title": item["snippet"]["title"],
                "video_id": item["id"]["videoId"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel_title": item["snippet"]["channelTitle"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            })
            
        return videos
    except Exception as e:
        print(f"YouTube Search Error for '{query}': {str(e)}")
        return []

def extract_exercises_from_plan(plan_text: str) -> List[str]:
    """Basic extraction of exercise names from the textual plan to search for."""
    # This is a very simplified extractor. For a robust app, the LLM should output structured JSON
    # with specific exercise names.
    exercises = []
    lines = plan_text.split('\n')
    for line in lines:
        line = line.strip()
        # Look for common list patterns in markdown
        if line.startswith('- ') or line.startswith('* ') or (len(line) > 2 and line[0].isdigit() and line[1] == '.'):
            # Clean up the line to try and just get the exercise name
            # Heuristic: Take the first few words or split by colon
            clean_line = line.lstrip('*-0123456789. ')
            if ':' in clean_line:
                exercises.append(clean_line.split(':')[0].strip())
            else:
                 # If it's a short bullet, it might be an exercise
                if len(clean_line.split()) <= 4:
                   exercises.append(clean_line)
                   
    # Deduplicate and limit
    return list(dict.fromkeys(exercises))[:5]

def search_recipe_videos(query: str, max_results: int = 1) -> Dict[str, Any]:
    """Search YouTube for recipe tutorial videos"""
    youtube = get_youtube_client()
    if not youtube:
        return None
        
    try:
        search_query = f"{query} recipe tutorial"
        
        request = youtube.search().list(
            part="snippet",
            maxResults=max_results,
            q=search_query,
            type="video",
            videoDuration="short"
        )
        response = request.execute()
        
        items = response.get("items", [])
        if items:
            item = items[0]
            return {
                "title": item["snippet"]["title"],
                "video_id": item["id"]["videoId"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel_title": item["snippet"]["channelTitle"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            }
        return None
    except Exception as e:
        print(f"YouTube Recipe Search Error for '{query}': {str(e)}")
        return None

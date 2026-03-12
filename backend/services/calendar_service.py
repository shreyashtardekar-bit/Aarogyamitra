import os
import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def get_calendar_service(token_json: str = None):
    """
    Get an authenticated Google Calendar API service instance.
    In a real app, you'd store the OAuth tokens in the database per user.
    """
    creds = None
    
    # Normally we load this from a user's profile in the DB
    # For this demo, let's just assume we return None if not auth'd
    if not token_json:
        return None
        
    try:
        import json
        creds_data = json.loads(token_json)
        creds = Credentials.from_authorized_user_info(creds_data, SCOPES)
        
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"Calendar Auth Error: {e}")
        return None

def add_workout_to_calendar(service, plan_title: str, start_time: datetime.datetime, duration_minutes: int = 45):
    """Add a workout session to the user's primary calendar"""
    if not service:
        return False
        
    try:
        end_time = start_time + datetime.timedelta(minutes=duration_minutes)
        
        event = {
          'summary': f'🏋️ ArogyaMitra Workout: {plan_title}',
          'description': 'Time for your personalized ArogyaMitra workout session! Get moving and stay healthy.',
          'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'UTC',
          },
          'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': 'UTC',
          },
          'reminders': {
            'useDefault': False,
            'overrides': [
              {'method': 'popup', 'minutes': 30},
            ],
          },
        }

        created_event = service.events().insert(calendarId='primary', body=event).execute()
        return created_event.get('htmlLink')
    except Exception as e:
        print(f"Error adding to calendar: {e}")
        return None

def get_auth_url():
    """Get the Google OAuth login URL - placeholders for a real impl"""
    # For a full implementation, you'd use google_auth_oauthlib flow here.
    return "https://accounts.google.com/o/oauth2/auth?..."

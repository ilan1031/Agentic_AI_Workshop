from icalendar import Calendar
import csv
from datetime import datetime, timedelta
from backend.config import Config

class DeadlineTrackerAgent:
    def __init__(self):
        self.calendar = self._load_calendar()

    def _load_calendar(self):
        events = []
        if not os.path.exists(Config.CALENDAR_PATH):
            return events
            
        if Config.CALENDAR_PATH.endswith('.ics'):
            with open(Config.CALENDAR_PATH, 'rb') as f:
                cal = Calendar.from_ical(f.read())
                for component in cal.walk():
                    if component.name == 'VEVENT':
                        events.append({
                            'summary': str(component.get('summary')),
                            'start': component.get('dtstart').dt,
                            'end': component.get('dtend').dt
                        })
        elif Config.CALENDAR_PATH.endswith('.csv'):
            with open(Config.CALENDAR_PATH, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    events.append({
                        'summary': row['Event'],
                        'start': datetime.strptime(row['Start Date'], '%Y-%m-%d'),
                        'end': datetime.strptime(row['End Date'], '%Y-%m-%d')
                    })
        return events

    def get_upcoming_deadlines(self, days=7):
        now = datetime.now()
        upcoming = []
        
        for event in self.calendar:
            if now <= event['start'] <= (now + timedelta(days=days)):
                upcoming.append(event)
        
        return upcoming
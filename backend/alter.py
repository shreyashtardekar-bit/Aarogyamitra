import sqlite3
conn = sqlite3.connect('arogyamitra.db')
c = conn.cursor()
try:
    c.execute('ALTER TABLE meal_plans ADD COLUMN recipes TEXT')
except Exception as e:
    print('Meal Plan error:', e)
try:
    c.execute('ALTER TABLE workout_plans ADD COLUMN youtube_videos TEXT')
except Exception as e:
    print('Workout error:', e)
conn.commit()
conn.close()
print('SQL Executed')

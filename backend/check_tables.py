import sqlite3
conn = sqlite3.connect('startup.db')
cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print("Tables:", tables)
print("action_items exists:", "action_items" in tables)
conn.close()

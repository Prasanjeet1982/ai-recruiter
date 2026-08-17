import os
import shutil
import json

src_data_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
dest_data_dir = os.path.join(os.path.dirname(__file__), '..', 'app', 'data')

os.makedirs(dest_data_dir, exist_ok=True)

files = [
    'candidates.json',
    'questions.json',
    'interviewers.json',
    'hiringManagers.json',
    'historicalInterviews.json',
    'mockWorkdayRecords.json',
    'mockSlackMessages.json'
]

for f in files:
    src_path = os.path.join(src_data_dir, f)
    dest_path = os.path.join(dest_data_dir, f)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Copied {f} to app/data/")
    else:
        print(f"Warning: {src_path} does not exist")

print("App data setup complete!")

import os
import glob
import re

directory = 'frontend/src'
search_url = 'http://localhost:8000'
replace_url = '${import.meta.env.VITE_API_URL}'

for filepath in glob.glob(directory + '/**/*.jsx', recursive=True):
    with open(filepath, 'r') as file:
        content = file.read()
    
    if search_url in content:
        # We need to handle both single quotes 'http...' and backticks `http...`
        # For single/double quotes, we convert to backticks.
        # e.g., 'http://localhost:8000/api/' -> `${import.meta.env.VITE_API_URL}/api/`
        content = re.sub(r"['\"]http://localhost:8000(.*?)(?<!\\)['\"]", r"`${import.meta.env.VITE_API_URL}\1`", content)
        # For backticks, we just replace
        content = content.replace("http://localhost:8000", "${import.meta.env.VITE_API_URL}")
        
        with open(filepath, 'w') as file:
            file.write(content)
        print(f"Updated {filepath}")

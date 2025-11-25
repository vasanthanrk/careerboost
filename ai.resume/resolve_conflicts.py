#!/usr/bin/env python3
"""Resolve Git merge conflicts by keeping HEAD changes"""

import re

def resolve_conflicts(filepath):
    """Remove conflict markers and keep HEAD version"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match conflict blocks
    # <<<<<<< HEAD
    # ... content ...
    # =======
    # ... other content ...
    # >>>>>>> commit_hash
    
    pattern = r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+\n'
    
    # Replace with just the HEAD content
    resolved = re.sub(pattern, r'\1\n', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(resolved)
    
    return resolved != content  # Returns True if changes were made

# Resolve conflicts in both files
files_to_fix = [
    'src/components/LandingPageOne.tsx',
    'src/components/ResumeEditor.tsx'
]

for filepath in files_to_fix:
    try:
        if resolve_conflicts(filepath):
            print(f"✅ Resolved conflicts in {filepath}")
        else:
            print(f"ℹ️  No conflicts found in {filepath}")
    except Exception as e:
        print(f"❌ Error resolving {filepath}: {e}")

print("\n✅ All conflicts resolved! Keeping HEAD (your current changes)")

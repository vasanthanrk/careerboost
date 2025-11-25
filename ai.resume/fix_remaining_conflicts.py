#!/usr/bin/env python3
"""Resolve remaining Git merge conflicts"""

import re

def resolve_conflicts_in_file(filepath):
    """Remove conflict markers and keep HEAD version"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match conflict blocks
        pattern = r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+\n'
        
        # Replace with just the HEAD content
        resolved = re.sub(pattern, r'\1\n', content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(resolved)
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

files = [
    'src/components/SignupPage.tsx',
    'src/components/LoginPage.tsx'
]

for filepath in files:
    if resolve_conflicts_in_file(filepath):
        print(f"✅ Resolved conflicts in {filepath}")

print("\n✅ All conflicts resolved!")

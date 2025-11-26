#!/usr/bin/env python3
"""Resolve all Git merge conflicts by keeping HEAD changes"""

import re
import subprocess

def resolve_conflicts(filepath):
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
        print(f"❌ Error resolving {filepath}: {e}")
        return False

# Get list of unmerged files
result = subprocess.run(['git', 'diff', '--name-only', '--diff-filter=U'], 
                       capture_output=True, text=True)
unmerged_files = result.stdout.strip().split('\n')

print(f"Found {len(unmerged_files)} files with conflicts:")
for filepath in unmerged_files:
    print(f"  - {filepath}")

print("\nResolving conflicts...")
for filepath in unmerged_files:
    if filepath and resolve_conflicts(filepath):
        print(f"✅ Resolved conflicts in {filepath}")
        # Stage the resolved file
        subprocess.run(['git', 'add', filepath])

print("\n✅ All conflicts resolved and staged!")
print("You can now commit the merge.")

#!/usr/bin/env python3
"""Fix the template modal to use horizontal scrolling and remove template names"""

# Read the file
with open('src/components/ResumeEditor.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and replace the specific sections
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Change 1: Replace grid with flex for horizontal scrolling (around line 483)
    if 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"' in line:
        new_lines.append(line.replace(
            'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"',
            'className="flex gap-6 overflow-x-auto pb-4 h-full"'
        ))
        i += 1
        continue
    
    # Change 2: Add flex-shrink-0 and w-64 to template cards (around line 488)
    if 'className={`border rounded-lg cursor-pointer' in line:
        new_lines.append(line.replace(
            'className={`border rounded-lg cursor-pointer',
            'className={`flex-shrink-0 w-64 border rounded-lg cursor-pointer'
        ))
        i += 1
        continue
    
    # Change 3: Reduce image height from h-80 to h-64 and add rounded corners (around line 494)
    if 'className="relative w-full h-72 "' in line:
        new_lines.append(line.replace(
            'className="relative w-full h-72 "',
            'className="relative w-full h-64"'
        ))
        i += 1
        continue
    
    # Change 4: Add rounded corners to images
    if 'className="w-full h-full object-cover"' in line and '/>' in line:
        new_lines.append(line.replace(
            'className="w-full h-full object-cover"',
            'className="w-full h-full object-cover rounded-lg"'
        ))
        i += 1
        continue
    
    # Change 5: Remove the template name div (lines 501-503)
    if '<div className="p-3 text-center">' in line:
        # Skip this line and the next 2 lines (the <p> tag and closing </div>)
        i += 3
        continue
    
    # Keep all other lines
    new_lines.append(line)
    i += 1

# Write back
with open('src/components/ResumeEditor.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Modal layout fixed!")
print("✅ Changed to horizontal scrolling")
print("✅ Reduced image height to h-64")
print("✅ Removed template names")

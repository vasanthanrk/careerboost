#!/usr/bin/env python3
"""
Complete fix for template modal:
1. Remove ScrollArea
2. Enable horizontal scrolling
3. Increase card width and image height
4. Add hover popup for large preview
"""

# Read the file
with open('src/components/ResumeEditor.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the template section and rebuild it
new_lines = []
i = 0
in_template_section = False

while i < len(lines):
    line = lines[i]
    
    # Detect start of template section
    if '{/* Horizontal Scrollable Content */}' in line or '{/* ✅ Scrollable Main Content */}' in line:
        in_template_section = True
        # Insert the new horizontal scrolling section
        new_lines.append('              {/* Horizontal Scrollable Content */}\n')
        new_lines.append('              <div className="flex-1 px-6 py-6 bg-gray-50 overflow-hidden">\n')
        new_lines.append('                {templates.length === 0 ? (\n')
        new_lines.append('                  <div className="flex items-center justify-center h-full text-gray-500">\n')
        new_lines.append('                    Loading templates...\n')
        new_lines.append('                  </div>\n')
        new_lines.append('                ) : (\n')
        new_lines.append('                  <div className="flex gap-6 overflow-x-auto pb-4 h-full">\n')
        new_lines.append('                    {templates.map((t) => (\n')
        new_lines.append('                      <div\n')
        new_lines.append('                        key={t.id}\n')
        new_lines.append('                        onClick={() => setSelectedTemplate(t.id)}\n')
        new_lines.append('                        className={`group relative flex-shrink-0 w-80 border rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all ${\n')
        new_lines.append('                          selectedTemplate === t.id\n')
        new_lines.append('                            ? "border-violet-600 ring-2 ring-violet-400"\n')
        new_lines.append('                            : "border-gray-200"\n')
        new_lines.append('                        }`}\n')
        new_lines.append('                      >\n')
        new_lines.append('                        <div className="relative w-full h-96">\n')
        new_lines.append('                          <img\n')
        new_lines.append('                            src={t.thumbnail}\n')
        new_lines.append('                            alt={t.name}\n')
        new_lines.append('                            className="w-full h-full object-cover rounded-lg"\n')
        new_lines.append('                          />\n')
        new_lines.append('                        </div>\n')
        new_lines.append('                        \n')
        new_lines.append('                        {/* Hover Popup - Large Preview */}\n')
        new_lines.append('                        <div className="absolute left-full ml-4 top-0 z-50 hidden group-hover:block pointer-events-none">\n')
        new_lines.append('                          <div className="bg-white rounded-lg shadow-2xl border-2 border-violet-500 p-2 w-96">\n')
        new_lines.append('                            <img\n')
        new_lines.append('                              src={t.thumbnail}\n')
        new_lines.append('                              alt={`${t.name} - Large Preview`}\n')
        new_lines.append('                              className="w-full h-auto object-contain rounded"\n')
        new_lines.append('                            />\n')
        new_lines.append('                            <p className="text-center mt-2 font-semibold text-gray-700">{t.name}</p>\n')
        new_lines.append('                          </div>\n')
        new_lines.append('                        </div>\n')
        new_lines.append('                      </div>\n')
        new_lines.append('                    ))}\n')
        new_lines.append('                  </div>\n')
        new_lines.append('                )}\n')
        new_lines.append('              </div>\n')
        new_lines.append('\n')
        
        # Skip until we find the footer
        while i < len(lines) and '{/* Sticky Footer */}' not in lines[i]:
            i += 1
        continue
    
    # Keep all other lines
    if not in_template_section:
        new_lines.append(line)
    elif '{/* Sticky Footer */}' in line:
        in_template_section = False
        new_lines.append(line)
    
    i += 1

# Write back
with open('src/components/ResumeEditor.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Template modal fixed successfully!")
print("✅ Horizontal scrolling enabled")
print("✅ Larger cards (w-80) and images (h-96)")
print("✅ Hover popup added for large preview")
print("✅ Template names removed from cards")
print("✅ Template names shown only in hover popup")

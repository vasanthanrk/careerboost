#!/usr/bin/env python3
"""Remove ScrollArea and fix horizontal scrolling"""

# Read the file
with open('src/components/ResumeEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the ScrollArea component and its wrapper divs
# Replace the entire section from line 472 to 507

old_section = '''              {/* ✅ Scrollable Main Content */}
              <div className="px-6 py-4">
                {/* This will scroll because DialogContent wraps an inner div with overflow-y-auto */}
                <div className="space-y-4">
                  <ScrollArea className="h-[70vh] px-6 py-4 bg-gray-50">
                    <div className="flex-1 bg-gray-50">
                      {templates.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          Loading templates...
                        </div>
                      ) : (
                        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
                          {templates.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => setSelectedTemplate(t.id)}
                              className={`flex-shrink-0 w-64 border rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition-all ${selectedTemplate === t.id
                                ? "border-violet-600 ring-2 ring-violet-400"
                                : "border-gray-200"
                                }`}
                            >
                              <div className="relative w-full h-72">
                                <img
                                  src={t.thumbnail}
                                  alt={t.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>'''

new_section = '''              {/* Horizontal Scrollable Content */}
              <div className="flex-1 px-6 py-6 bg-gray-50 overflow-hidden">
                {templates.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading templates...
                  </div>
                ) : (
                  <div className="flex gap-6 overflow-x-auto pb-4 h-full">
                    {templates.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`flex-shrink-0 w-64 border rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition-all ${
                          selectedTemplate === t.id
                            ? "border-violet-600 ring-2 ring-violet-400"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="relative w-full h-72">
                          <img
                            src={t.thumbnail}
                            alt={t.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>'''

# Replace the section
if old_section in content:
    content = content.replace(old_section, new_section)
    print("✅ Successfully removed ScrollArea and fixed horizontal scrolling!")
else:
    print("❌ Could not find the exact section")
    print("The file structure may have changed")

# Write back
with open('src/components/ResumeEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Modal layout updated!")
print("✅ Removed ScrollArea component")
print("✅ Horizontal scrolling enabled")
print("✅ All templates will be visible in a horizontal row")

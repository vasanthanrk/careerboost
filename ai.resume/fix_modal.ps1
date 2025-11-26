# PowerShell script to fix the template modal layout

$file = "src\components\ResumeEditor.tsx"
$content = Get-Content $file -Raw

# Step 1: Remove the ScrollArea and simplify the structure
# Replace the entire modal content section (lines 459-526) with the new horizontal scroll version

$oldPattern = @'
            <div className="flex-1 overflow-y-auto bg-gray-50" style=\{\{ maxHeight: "80vh" \}\}>
                \{/\* Sticky Header \*/\}
              <div className="px-6 pt-6 pb-4 border-b bg-white shrink-0">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Select Resume Template
                  </DialogTitle>
                  <DialogDescription>
                    Preview available resume layouts and select one to download\.
                  </DialogDescription>
                </DialogHeader>
              </div>

              \{/\* ✅ Scrollable Main Content \*/\}
              <div className="px-6 py-4">
                \{/\* This will scroll because DialogContent wraps an inner div with overflow-y-auto \*/\}
                <div className="space-y-4">
                  <ScrollArea className="h-\[70vh\] px-6 py-4 bg-gray-50">
                    <div className="flex-1 bg-gray-50">
                    \{templates\.length === 0 \? \(
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            Loading templates\.\.\.
                        </div>
                      \) : \(
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
'@

$newPattern = @'
            {/* Sticky Header */}
            <div className="px-6 pt-6 pb-4 border-b bg-white shrink-0">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Select Resume Template
                </DialogTitle>
                <DialogDescription>
                  Preview available resume layouts and select one to download.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Horizontal Scrollable Content */}
            <div className="flex-1 px-6 py-6 bg-gray-50 overflow-hidden">
              {templates.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading templates...
                </div>
              ) : (
                <div className="flex gap-6 overflow-x-auto pb-4 h-full">
'@

$content = $content -replace [regex]::Escape($oldPattern), $newPattern

# Step 2: Add flex-shrink-0 and w-64 to template cards
$content = $content -replace 'className=\{`border rounded-lg cursor-pointer', 'className={`flex-shrink-0 w-64 border rounded-lg cursor-pointer'

# Step 3: Update image height
$content = $content -replace 'className="relative w-full h-72 "', 'className="relative w-full h-80"'

# Step 4: Add rounded corners to images
$content = $content -replace 'className="w-full h-full object-cover"', 'className="w-full h-full object-cover rounded-t-lg"'

# Step 5: Close the divs properly - remove the extra closing tags from ScrollArea
$content = $content -replace '                    </div>\r\n                  </ScrollArea>\r\n                </div>\r\n              </div>\r\n              \r\n              \{/\* Sticky Footer \*/\}', '              )}\r\n            </div>\r\n            \r\n            {/* Sticky Footer */}'

# Save the file
Set-Content $file $content -NoNewline

Write-Host "Modal layout fixed successfully!"
'@

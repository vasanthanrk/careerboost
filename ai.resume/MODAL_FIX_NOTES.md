## Horizontal Template Scrolling

### Issue
The template selection modal currently has vertical scrolling with a grid layout. The user wants horizontal scrolling like a slider, with all templates visible in a horizontal row.

### Solution
I need to:
1. Remove the `ScrollArea` component wrapper
2. Change from grid layout to flex layout with `overflow-x-auto`
3. Add fixed width (`w-64`) and `flex-shrink-0` to template cards
4. Simplify the div structure to remove unnecessary nesting
5. Make the buttons fixed at the bottom

### Current Structure Issues
- Line 476: `<ScrollArea>` component creates vertical scrolling
- Line 483: Grid layout (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- Line 459: Outer div has `overflow-y-auto` causing vertical scroll
- Multiple nested divs (lines 473, 475, 477) add complexity

### Manual Edit Required
Due to file complexity, the automated replacement tool is failing. The user will need to manually edit the file or I can provide the exact code to copy-paste.

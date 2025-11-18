# Interactive Mindmap - User Guide

## Overview

The Interactive Mindmap is a new feature that displays document content as an expandable/collapsible tree structure. Users can click on nodes to expand or collapse them, making it easy to navigate complex information.

## Features

### 1. Node Rendering
- **Main Topics (H1)**: Large, bold, primary color
- **Categories (H2)**: Medium, semibold, foreground color
- **Details (H3+)**: Small, muted color
- **Leaf Nodes**: Show bullet indicator (•)
- **Parent Nodes**: Show expand/collapse arrow (▶/▼)

### 2. Interactions

#### Click to Expand/Collapse
- Click any parent node to expand/collapse its children
- Leaf nodes cannot be clicked
- Visual feedback on hover

#### Expand All Button
- Opens all nodes in the mindmap
- Shows complete hierarchy
- Useful for overview

#### Collapse All Button
- Closes all nodes except root
- Hides details
- Useful for focusing on main topics

### 3. Visual Hierarchy
```
# Main Topic (H1)
├── ## Category 1 (H2)
│   ├── ### Detail 1.1 (H3)
│   ├── ### Detail 1.2 (H3)
│   └── ### Detail 1.3 (H3)
├── ## Category 2 (H2)
│   ├── ### Detail 2.1 (H3)
│   └── ### Detail 2.2 (H3)
└── ## Category 3 (H2)
    └── ### Detail 3.1 (H3)
```

## How to Use

### Step 1: Generate Mindmap
1. Upload a PDF document
2. Click "Generate Mindmap" button
3. Wait for generation to complete

### Step 2: Explore the Mindmap
1. **View Structure**: See the complete hierarchy
2. **Expand Nodes**: Click on any node with children to expand
3. **Collapse Nodes**: Click again to collapse
4. **Use Buttons**: 
   - "Expand All" to see everything
   - "Collapse All" to hide details

### Step 3: Navigate
- Scroll within the mindmap container
- Use keyboard to navigate (arrow keys)
- Click nodes to focus on specific areas

## Example Mindmap

```
# Machine Learning
├── ## Fundamentals
│   ├── ### What is ML?
│   ├── ### Types of Learning
│   │   ├── Supervised Learning
│   │   ├── Unsupervised Learning
│   │   └── Reinforcement Learning
│   └── ### Key Concepts
├── ## Algorithms
│   ├── ### Regression
│   ├── ### Classification
│   └── ### Clustering
└── ## Applications
    ├── ### Computer Vision
    ├── ### Natural Language Processing
    └── ### Recommendation Systems
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Click | Expand/Collapse node |
| Scroll | Navigate mindmap |
| Tab | Focus next element |
| Enter | Activate focused element |

## Tips & Tricks

### 1. Start with Collapse All
- Get overview of main topics
- Expand only what interests you
- Reduces cognitive load

### 2. Use Expand All for Review
- See complete structure
- Useful for final review
- Good for printing/exporting

### 3. Focus on Specific Branches
- Collapse unrelated sections
- Focus on one topic at a time
- Better for deep learning

### 4. Combine with Other Tools
- Use Chat to ask about specific nodes
- Generate Flashcards from expanded sections
- Create Summary of focused topics

## Troubleshooting

### Mindmap Not Showing
- Ensure PDF is uploaded
- Check that document has content
- Try generating again

### Nodes Not Expanding
- Ensure node has children
- Check if it's a leaf node (bullet indicator)
- Try "Expand All" button

### Text Truncated
- Scroll horizontally in container
- Expand container width
- Use browser zoom if needed

## Performance

- **Fast Rendering**: Renders 100+ nodes smoothly
- **Smooth Animations**: Transitions are fluid
- **Responsive**: Works on all screen sizes
- **Accessible**: Keyboard navigation supported

## Customization

### Styling
The mindmap uses Tailwind CSS classes:
- Colors: Primary, foreground, muted-foreground
- Spacing: Consistent padding and margins
- Hover effects: Subtle background change

### Expanding Behavior
- Default: All nodes collapsed
- Click: Toggle expand/collapse
- Buttons: Expand/Collapse all at once

## Integration with Other Features

### Chat
Ask questions about specific nodes:
- "Explain this concept"
- "Give examples of this"
- "How does this relate to..."

### Flashcards
Generate flashcards from expanded sections:
- Expand relevant section
- Generate flashcards
- Study specific topic

### Summary
Create summaries of focused areas:
- Expand topic of interest
- Generate summary
- Get concise overview

## Best Practices

1. **Start Collapsed**: Begin with overview
2. **Expand Gradually**: Explore one section at a time
3. **Use Buttons**: Expand/Collapse all for quick navigation
4. **Combine Tools**: Use with Chat and Flashcards
5. **Review Regularly**: Use for quick review sessions

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ High contrast colors
- ✅ Clear visual hierarchy
- ✅ Semantic HTML

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Future Enhancements

Potential improvements:
- Search within mindmap
- Drag and drop reordering
- Export as image/PDF
- Collaborative editing
- Custom styling options
- Animation preferences

## Feedback

Have suggestions? The mindmap is designed to be improved based on user feedback. Share your ideas!

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Status**: Production Ready

# Image Comparison Tool

A simple web-based tool to compare two images side by side with a draggable slider.

## Features

- **Visual Comparison**: Compare before/after images with an interactive slider
- **URL Sharing**: Share comparisons via URL parameters
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Drag slider with mouse or touch

## How to Use

1. **Enter Image URLs**
   - Paste the URL of your "before" image in the first field
   - Paste the URL of your "after" image in the second field

2. **Load Images**
   - Click the "Load Images" button
   - Drag the slider left and right to compare

3. **Share**
   - Click "Copy URL" to get a shareable link
   - Anyone with the link can view your comparison

## URL Parameters

You can share comparisons directly using URL parameters. **Note**: URLs must be URL-encoded (special characters like `:`, `/`, `?` converted to `%3A`, `%2F`, `%3F`).

Example (encoded):
```
?before=https%3A%2F%2Fexample.com%2Fbefore.jpg&after=https%3A%2F%2Fexample.com%2Fafter.jpg
```

**Tip**: The "Copy URL" button automatically handles encoding for you!

## Supported Image Sources

- Direct image URLs (ending in .jpg, .png, .gif, etc.)
- Image hosting services (Imgur, Cloudinary, etc.)
- Any publicly accessible image URL

## Tips

- Make sure URLs point directly to image files
- Use HTTPS URLs when possible
- Check that images are publicly accessible
- If images don't load, check your browser console for errors

## Technical Details

- Built with React
- Uses Tailwind CSS for styling
- No backend required - runs entirely in the browser
- No data is stored or transmitted to any server

## Live Demo

You can try out the working demo of the Image Comparison Tool by visiting the deployed version at [https://nDr3K.github.io/image-comparison-tool](https://nDr3K.github.io/image-comparison-tool). This live demo allows you to interact with the tool and test its functionality directly in your browser.

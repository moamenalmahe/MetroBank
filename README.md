# Metro Bank Website Improvements

This document outlines the improvements made to the Metro Bank website project to enhance performance, security, and maintainability.

## Performance Optimizations

### 1. Resource Loading
- Implemented resource hints (preconnect, preload) for critical assets
- Optimized font loading strategy with font-display and preloading
- Added modern CSS loading with fallback for older browsers

### 2. Image Optimization
- Added lazy loading for images using Intersection Observer
- Implemented WebP format support with fallbacks
- Added loading animations and placeholders
- Automated image optimization pipeline

### 3. Security Enhancements
- Updated Content Security Policy
- Added Permissions Policy
- Enhanced HSTS configuration
- Implemented additional security headers

## Getting Started

### Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher

### Installation
1. Install dependencies:
```bash
npm install
```

2. Run image optimization:
```bash
npm run optimize-images
```

## Image Optimization

The project includes an automated image optimization pipeline that:
- Converts images to WebP format
- Optimizes existing JPG/PNG files
- Maintains original aspect ratios
- Adds loading animations

### Usage
1. Place new images in the `Static/images` directory
2. Run the optimization script:
```bash
npm run optimize-images
```

## Development Guidelines

### Adding New Images
1. Place images in the appropriate directory under `Static/images`
2. Use the `img-container` class for responsive images:
```html
<div class="img-container">
    <img data-src="path/to/image.jpg" alt="Description">
</div>
```

### CSS Classes
- `img-container`: Responsive image container
- `img-loading`: Applied during image load
- `img-loaded`: Applied after successful load

## Browser Support
- Modern browsers: Full support
- IE11 and older: Graceful fallback for image loading
- WebP: Automatic fallback to JPG/PNG for unsupported browsers

## Security
- CSP is configured for enhanced security
- Third-party resources are properly configured
- Implemented Permissions Policy for additional security

## Performance Monitoring
Monitor performance using:
- Browser DevTools
- Lighthouse reports
- Web Vitals metrics

## Contributing
1. Follow the existing code structure
2. Use the image optimization pipeline for new images
3. Test across different browsers and devices
4. Maintain accessibility standards

## License
Proprietary - Metro Bank PLC 

# Metrobankdemo

A demo version of the Metro Bank website for demonstration purposes.

## Quick Start

To run this project locally:

1. Install dependencies:
```bash
npm install
```

2. Start the local server:
```bash
npm start
```

The site will be available at `http://localhost:3000`

## Deployment

### Option 1: GitHub Pages (Recommended)

1. Create a new repository on GitHub named `metrobankdemo`

2. Initialize git and push to your repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/metrobankdemo.git
git push -u origin main
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

Your site will be available at `https://yourusername.github.io/metrobankdemo`

### Option 2: Static Hosting

1. Build the project:
```bash
npm run build
```

2. Upload the contents of the `dist` folder to your web hosting service.

## Sharing with Friends

You can share your site using one of these methods:

1. Share the GitHub Pages URL (if using Option 1)
2. Share your custom domain URL (if using Option 2)
3. For local testing, you can use tools like ngrok:
```bash
npx ngrok http 3000
```

## Important Notes

- This is a demo version for demonstration purposes only
- All sensitive information and real banking functionality has been removed
- Images and content are used for demonstration only

## License

MIT License - See LICENSE file for details 

# Metrobank Demo Website

## Deployment Instructions

### Deploy to Render.com (Recommended)

1. Create a Render.com account at https://render.com

2. Click "New +" and select "Web Service"

3. Connect your GitHub repository or use the following deployment steps:

   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. In Render.com:
   - Name: metrobank
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`

5. Click "Create Web Service"

Your site will be live at: `https://metrobank.onrender.com`

### Sharing the Website

Once deployed, you can share these links with anyone:
- Main website: `https://metrobank.onrender.com`
- Direct link: [Click here to visit Metrobank](https://metrobank.onrender.com)

### Local Development

To run the website locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Visit `http://localhost:3000` in your browser

## Note
This is a demo version for demonstration purposes only. 
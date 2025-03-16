# Theme Generator

A web-based tool that generates a complete color theme from a single primary color. This tool uses a formula derived from analyzing the relationships between colors in a professional design system.

## Features

- Generate a complete theme by entering a single hex color code
- See real-time preview of how the colors work together
- Copy individual color codes with a single click
- Export the entire theme as CSS variables, JSON, or Tailwind config
- Download theme configurations as files
- Responsive design that works on mobile and desktop

## How It Works

The theme generator analyzes the relationships between colors in terms of hue, saturation, and lightness (HSL). When you input a primary color, it:

1. Converts the hex color to HSL
2. Applies specific transformations based on the color relationships formula
3. Generates a complete set of related colors
4. Converts all colors back to hex format for display and export

## Color Relationships

The generator produces the following colors based on your primary color:

- **primary**: Your input color
- **primaryAccent**: A lighter version of your primary color
- **primaryAlt**: A shifted hue with higher saturation
- **primaryAltAccent**: A darker, desaturated version of your primary
- **main**: A dark neutral color with fixed hue (blue-black)
- **mainAccent**: A light version of the main color
- **base**: White (#FFFFFF)
- **secondary**: A medium-dark neutral with the same hue as main
- **tertiary**: A very light blue-lavender
- **borderLight**: A light border color
- **borderDark**: A dark border color with a purple hue

## Installation

This is a standalone web application that requires no installation. Simply:

1. Download all files
2. Open `index.html` in a web browser

### Hosting Options

For online hosting:

1. Upload all files to your web server
2. No server-side processing is required - it's purely client-side JavaScript

## Usage

1. Enter a hex color code or use the color picker
2. The theme will update automatically
3. Click any color to copy its hex code
4. Use the export buttons to copy the entire theme as CSS variables, JSON, or Tailwind configuration
5. Download the theme as a file for your project

## Browser Compatibility

The Theme Generator works in all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## Credits

This theme generator uses a formula derived from analyzing the relationships between colors in professional design systems. It leverages React for the UI and various helper functions for color calculations and transformations.

## License

MIT

// Theme Generator App
const { useState, useEffect } = React;

const ThemeGenerator = () => {
  const [primaryColor, setPrimaryColor] = useState('#5344F4');
  const [theme, setTheme] = useState({});
  const [copied, setCopied] = useState('');

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { 
      r: Math.round(r * 255), 
      g: Math.round(g * 255), 
      b: Math.round(b * 255) 
    };
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  // Validate hex color
  const isValidHex = (hex) => {
    return /^#?([0-9A-F]{3}){1,2}$/i.test(hex);
  };

  // Generate theme based on primary color
  const generateTheme = (baseHex) => {
    if (!isValidHex(baseHex)) {
      return {};
    }

    // Ensure the hex has a # prefix
    const formattedHex = baseHex.charAt(0) === '#' ? baseHex : `#${baseHex}`;
    
    const baseRgb = hexToRgb(formattedHex);
    if (!baseRgb) return {};
    
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    
    // Calculate new theme - all colors relative to the base color
    const newTheme = {
      primary: formattedHex
    };
    
    // Lighter version of primary (tint)
    const primaryAccentRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 10, 10), 
      Math.min(baseHsl.l + 30, 95)
    );
    newTheme.primaryAccent = rgbToHex(primaryAccentRgb.r, primaryAccentRgb.g, primaryAccentRgb.b);
    
    // Color shift toward warmer tones
    const primaryAltRgb = hslToRgb(
      (baseHsl.h - 20 + 360) % 360, 
      Math.min(baseHsl.s + 10, 100), 
      Math.min(baseHsl.l + 5, 85)
    );
    newTheme.primaryAlt = rgbToHex(primaryAltRgb.r, primaryAltRgb.g, primaryAltRgb.b);
    
    // Darker version of primary (shade)
    const primaryAltAccentRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 15, 20), 
      Math.max(baseHsl.l - 20, 25)
    );
    newTheme.primaryAltAccent = rgbToHex(primaryAltAccentRgb.r, primaryAltAccentRgb.g, primaryAltAccentRgb.b);
    
    // Dark neutral based on primary hue
    const mainRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 70, 5), 
      Math.max(15, Math.min(baseHsl.l - 40, 20))
    );
    newTheme.main = rgbToHex(mainRgb.r, mainRgb.g, mainRgb.b);
    
    // Light neutral based on primary hue
    const mainAccentRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 50, 5), 
      Math.min(baseHsl.l + 25, 90)
    );
    newTheme.mainAccent = rgbToHex(mainAccentRgb.r, mainAccentRgb.g, mainAccentRgb.b);
    
    // Pure white (remains constant)
    newTheme.base = "#FFFFFF";
    
    // Medium neutral based on primary hue
    const secondaryRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 60, 10), 
      Math.max(baseHsl.l - 15, 40)
    );
    newTheme.secondary = rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    
    // Very light tint based on primary hue
    const tertiaryRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 40, 5), 
      Math.min(98, Math.max(baseHsl.l + 30, 90))
    );
    newTheme.tertiary = rgbToHex(tertiaryRgb.r, tertiaryRgb.g, tertiaryRgb.b);
    
    // Light border color based on primary
    const borderLightRgb = hslToRgb(
      baseHsl.h, 
      Math.max(baseHsl.s - 60, 5), 
      Math.min(baseHsl.l + 30, 90)
    );
    newTheme.borderLight = rgbToHex(borderLightRgb.r, borderLightRgb.g, borderLightRgb.b);
    
    // Dark border color based on primary
    const borderDarkRgb = hslToRgb(
      (baseHsl.h + 5) % 360, 
      Math.max(baseHsl.s - 40, 15), 
      Math.max(baseHsl.l - 25, 25)
    );
    newTheme.borderDark = rgbToHex(borderDarkRgb.r, borderDarkRgb.g, borderDarkRgb.b);
    
    return newTheme;
  };

  // Calculate theme whenever primary color changes
  useEffect(() => {
    setTheme(generateTheme(primaryColor));
  }, [primaryColor]);

  // Handle color input change
  const handleColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  // Handle manual hex input
  const handleHexInput = (e) => {
    const value = e.target.value;
    if (value.length <= 7) {
      setPrimaryColor(value);
    }
  };

  // Handle random color generation
  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setPrimaryColor(randomColor);
  };

  // Copy color to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";  // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy. Your browser may not support this feature.');
      }
      
      document.body.removeChild(textArea);
    });
  };

  // Copy theme as JSON
  const copyThemeAsJSON = () => {
    const json = JSON.stringify(theme, null, 2);
    copyToClipboard(json, 'JSON');
  };

  // Copy theme as CSS variables
  const copyThemeAsCSS = () => {
    let css = ":root {\n";
    Object.entries(theme).forEach(([name, value]) => {
      // Convert camelCase to kebab-case
      const kebabName = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
      css += `  --color-${kebabName}: ${value};\n`;
    });
    css += "}";
    
    copyToClipboard(css, 'CSS');
  };

  // Copy theme as Tailwind config
  const copyThemeAsTailwind = () => {
    let tailwindConfig = `module.exports = {
  theme: {
    extend: {
      colors: {`;
      
    Object.entries(theme).forEach(([name, value]) => {
      tailwindConfig += `\n        ${name}: '${value}',`;
    });
    
    tailwindConfig += `\n      },
    },
  },
  plugins: [],
}`;
    
    copyToClipboard(tailwindConfig, 'Tailwind');
  };

  // Determine text color for contrast
  const getContrastYIQ = (hexcolor) => {
    const rgb = hexToRgb(hexcolor);
    if (!rgb) return 'black';
    const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-6">
        <h1 className="text-3xl font-bold">Theme Generator</h1>
        <p className="text-gray-300 mt-2">Generate a complete theme from a single color</p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Primary Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={primaryColor} 
                onChange={handleColorChange} 
                className="h-10 w-12 border rounded cursor-pointer"
              />
              <input 
                type="text" 
                value={primaryColor} 
                onChange={handleHexInput} 
                placeholder="#RRGGBB"
                className="flex-1 p-2 border rounded"
              />
              <button 
                onClick={generateRandomColor}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Random
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-2 items-end">
            <button 
              onClick={copyThemeAsJSON}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {copied === 'JSON' ? '✓ Copied!' : 'Copy as JSON'}
            </button>
            <button 
              onClick={copyThemeAsCSS}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {copied === 'CSS' ? '✓ Copied!' : 'Copy as CSS'}
            </button>
            <button 
              onClick={copyThemeAsTailwind}
              className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {copied === 'Tailwind' ? '✓ Copied!' : 'Copy as Tailwind'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color swatches */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold border-b pb-2">Color Palette</h2>
            
            {Object.entries(theme).map(([name, color]) => (
              <div 
                key={name}
                className="color-swatch flex items-center rounded-md overflow-hidden border shadow-sm hover:shadow"
              >
                <div 
                  className="w-16 h-16 flex-shrink-0" 
                  style={{ backgroundColor: color }}
                ></div>
                <div className="flex-1 p-3">
                  <div className="font-medium">{_.startCase(name)}</div>
                  <div className="text-sm text-gray-600">{color}</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(color, name)}
                  className="px-3 py-2 mx-2 rounded hover:bg-gray-100 transition"
                >
                  {copied === name ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
          
          {/* Preview panel */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold border-b pb-2">Preview</h2>
            
            <div id="preview" className="border rounded-md overflow-hidden shadow-md">
              {/* Header */}
              <div style={{ backgroundColor: theme.primary }} className="p-4">
                <h3 style={{ color: getContrastYIQ(theme.primary) }} className="text-lg font-bold">
                  Brand Header
                </h3>
              </div>
              
              {/* Main content */}
              <div style={{ backgroundColor: theme.base }} className="p-4">
                <div style={{ backgroundColor: theme.primaryAccent }} className="p-3 mb-4 rounded-md">
                  <p style={{ color: theme.main }} className="font-medium">Primary Accent Section</p>
                </div>
                
                <div style={{ backgroundColor: theme.tertiary }} className="p-3 mb-4 rounded-md">
                  <p style={{ color: theme.main }} className="font-medium">Tertiary Background</p>
                  <div style={{ backgroundColor: theme.primaryAlt }} className="mt-2 p-2 rounded-md">
                    <span style={{ color: getContrastYIQ(theme.primaryAlt) }}>Primary Alt</span>
                  </div>
                </div>
                
                <div style={{ backgroundColor: theme.main }} className="p-3 rounded-md">
                  <p style={{ color: theme.base }} className="font-medium">Main Dark Section</p>
                  <button 
                    style={{ 
                      backgroundColor: theme.primary,
                      color: getContrastYIQ(theme.primary),
                      borderColor: theme.borderLight
                    }} 
                    className="mt-2 px-4 py-1 rounded-md border transition-colors"
                  >
                    Button
                  </button>
                </div>
              </div>
              
              {/* Footer */}
              <div style={{ backgroundColor: theme.mainAccent, borderTop: `1px solid ${theme.borderLight}` }} className="p-4">
                <p style={{ color: theme.secondary }}>Footer area</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4 shadow-sm">
              <h3 className="font-medium mb-3">Text Samples</h3>
              <p style={{ color: theme.primary }} className="mb-2">Primary text</p>
              <p style={{ color: theme.secondary }} className="mb-2">Secondary text</p>
              <p style={{ color: theme.primaryAltAccent }} className="mb-2">Primary Alt Accent text</p>
              <div style={{ backgroundColor: theme.main, padding: '0.5rem' }} className="rounded-md">
                <p style={{ color: theme.base }}>Text on Main background</p>
              </div>
              <div style={{ backgroundColor: theme.mainAccent, padding: '0.5rem', marginTop: '0.5rem' }} className="rounded-md">
                <p style={{ color: theme.main }}>Text on Main Accent background</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Theme Generator v1.0</p>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<ThemeGenerator />, document.getElementById('root'));

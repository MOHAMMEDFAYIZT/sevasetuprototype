import os
from PIL import Image

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# Color palette for each service: vibrant unique color on 360-degree color wheel
# Electrician: Amber / Gold (#D97706)
# Plumber: Sky Blue (#0284C7)
# Cleaning: Emerald Teal (#0D9488)
# Carpenter: Rich Wood Warm Brown / Cinnamon (#B45309)
# Painter: Bright Orange (#EA580C)
# Gardening: Emerald Leaf Green (#16A34A)
# Farm Work: Golden Wheat (#CA8A04)
# Mechanic: Royal Blue (#2563EB)
# Cooking: Flame Red (#DC2626)
# Transport: Cyan / Ocean (#0891B2)
# Animal Care: Vivid Rose / Pink (#DB2777)
# General Labour: Deep Purple (#7C3AED)
# Tailor: Indigo (#4F46E5)
# Masonry: Brick Crimson (#BE123C)

SERVICES_META = {
    'electrician': ('seva setu/Electrician.png', '#D97706', 'dark_on_light'),
    'plumber': ('seva setu/Plumber.png', '#0284C7', 'white_on_color'),
    'cleaning': ('seva setu/Cleaning.png', '#0D9488', 'dark_on_light'),
    'carpenter': ('seva setu/Masonry.png', '#B45309', 'dark_on_light'), # Masonry/Trowel or Brickwork as craft
    'painter': ('seva setu/Painter.png', '#EA580C', 'dark_on_light'),
    'gardening': ('seva setu/gardening.png', '#16A34A', 'dark_on_light'),
    'farm-work': ('seva setu/farm work.png', '#CA8A04', 'dark_on_light'),
    'mechanic': ('seva setu/Mechanic.png', '#2563EB', 'dark_on_light'),
    'cooking': ('seva setu/Cooking.png', '#DC2626', 'dark_on_light'),
    'transport': ('seva setu/Transport.png', '#0891B2', 'dark_on_light'),
    'animal-care': ('seva setu/Animal Care.png', '#DB2777', 'dark_on_light'),
    'general-labour': ('seva setu/General Labour.png', '#7C3AED', 'dark_on_light'),
    'tailor': ('seva setu/Tailor.png', '#4F46E5', 'dark_on_light'),
}

os.makedirs('public/images/service-icons', exist_ok=True)
os.makedirs('dist/images/service-icons', exist_ok=True)

for svc_id, (src_file, color_hex, mode) in SERVICES_META.items():
    if not os.path.exists(src_file):
        print(f"Skipping {src_file}, not found")
        continue
    
    im = Image.open(src_file).convert('RGBA')
    w, h = im.size
    target_rgb = hex_to_rgb(color_hex)
    
    # Create mask of glyph
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out_pixels = out.load()
    in_pixels = im.load()
    
    glyph_coords = []
    
    if mode == 'white_on_color':
        # Plumber has white glyph inside colored circle (blue circle)
        # Background outside circle has alpha 0 or white.
        # Find white/near-white pixels inside circle:
        for y in range(h):
            for x in range(w):
                r, g, b, a = in_pixels[x, y]
                # Is it white/light glyph pixel?
                if a > 120 and r > 215 and g > 215 and b > 215:
                    glyph_coords.append((x, y))
                    out_pixels[x, y] = (*target_rgb, 255)
    else:
        # Dark glyph on pastel background:
        # The glyph pixels have low brightness compared to the pastel circle (>210) and white background (>250).
        for y in range(h):
            for x in range(w):
                r, g, b, a = in_pixels[x, y]
                # Check if it's the glyph: dark/saturated, not white bg (>245) and not pastel (>210 all channels)
                # To be smooth and include anti-aliasing edges:
                brightness = (r + g + b) / 3.0
                if brightness < 205:
                    # Antialiasing alpha
                    alpha = int(max(0, min(255, (205 - brightness) * 2.5)))
                    if alpha > 30:
                        glyph_coords.append((x, y))
                        out_pixels[x, y] = (*target_rgb, alpha)
                        
    if glyph_coords:
        min_x = min(p[0] for p in glyph_coords)
        max_x = max(p[0] for p in glyph_coords)
        min_y = min(p[1] for p in glyph_coords)
        max_y = max(p[1] for p in glyph_coords)
        
        # Crop glyph
        glyph_crop = out.crop((min_x, min_y, max_x + 1, max_y + 1))
        gw, gh = glyph_crop.size
        
        # Place centered in high-res square with padding
        target_size = 512
        final_im = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
        
        # Scale keeping aspect ratio
        max_dim = 390
        scale = min(max_dim / gw, max_dim / gh)
        new_w = int(gw * scale)
        new_h = int(gh * scale)
        
        resized = glyph_crop.resize((new_w, new_h), Image.LANCZOS)
        
        offset_x = (target_size - new_w) // 2
        offset_y = (target_size - new_h) // 2
        final_im.paste(resized, (offset_x, offset_y), resized)
        
        dst1 = f"public/images/service-icons/{svc_id}.png"
        dst2 = f"dist/images/service-icons/{svc_id}.png"
        final_im.save(dst1, format='PNG')
        final_im.save(dst2, format='PNG')
        print(f"Saved {svc_id}.png: bbox ({min_x},{min_y},{max_x},{max_y}) -> {new_w}x{new_h}")
    else:
        print(f"Error: No glyph coords found for {svc_id}")


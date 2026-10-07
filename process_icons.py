import os
from PIL import Image

def process_icon(src_path, dst_path, target_color):
    im = Image.open(src_path).convert('RGBA')
    w, h = im.size
    
    # Check if there is an outer circle/badge or white background.
    # Find pixels that are distinctly NOT background and NOT the outer colored circle.
    # Let's inspect unique colors or find the icon glyph.
    # Most icons have a glyph inside.
    pixels = im.load()
    
    # Create mask of the actual glyph
    # Let's find background color from corners
    corner_colors = [pixels[0,0], pixels[w-1, 0], pixels[0, h-1], pixels[w-1, h-1]]
    
    # Convert image to grayscale to analyze or threshold
    # In 'seva setu' icons, the glyph is either white inside a colored circle or a dark/colored glyph.
    # Let's see what each file looks like by analyzing pixel values.
    

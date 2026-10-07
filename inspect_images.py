from PIL import Image

for name in ['Electrician.png', 'Plumber.png', 'Cleaning.png', 'Masonry.png']:
    im = Image.open('seva setu/' + name).convert('RGB')
    w, h = im.size
    # scan a vertical line through center
    line = [im.getpixel((w//2, y)) for y in range(0, h, h//20)]
    print(name, 'vertical scan:')
    for idx, col in enumerate(line):
        print(f"  y={idx*5}%: {col}")

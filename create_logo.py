import os
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions matching user image aspect ratio
width, height = 400, 300
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Colors
blue_top_text = (0, 102, 196, 255)       # #0066C4
blue_bottom_bg_start = (0, 91, 160, 255) # #005BA0
blue_bottom_bg_end = (0, 50, 110, 255)   # #00326E
white = (255, 255, 255, 255)

# Fill bottom blue gradient area
for y in range(0, height):
    # Calculate gradient factor
    factor = y / float(height)
    r = int(blue_bottom_bg_start[0] * (1 - factor) + blue_bottom_bg_end[0] * factor)
    g = int(blue_bottom_bg_start[1] * (1 - factor) + blue_bottom_bg_end[1] * factor)
    b = int(blue_bottom_bg_start[2] * (1 - factor) + blue_bottom_bg_end[2] * factor)
    draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

# Draw top white box with iconic curved bottom-right slope
# Top white area covers y=0 to 180 on left, and curves up smoothly at the bottom right
white_polygon = [
    (0, 0),
    (width, 0),
    (width, 150),
]

# Create curve for bottom right of white section
curve_points = []
for x in range(width, -1, -1):
    if x > width - 80:
        # Smooth downward curve at the right edge
        t = (width - x) / 80.0
        y = 150 + int(35 * (1 - t*t))
    else:
        y = 185
    curve_points.append((x, y))

white_polygon.extend(curve_points)
white_polygon.append((0, 0))

draw.polygon(white_polygon, fill=white)

# Load fonts if available, or fallback to default
try:
    font_philips = ImageFont.truetype("arialbd.ttf", 64)
    font_lighting = ImageFont.truetype("arial.ttf", 46)
except Exception:
    font_philips = ImageFont.load_default()
    font_lighting = ImageFont.load_default()

# Draw "PHILIPS" in top white box
draw.text((32, 45), "PHILIPS", font=font_philips, fill=blue_top_text)

# Draw "Lighting" in bottom blue box
draw.text((32, 205), "Lighting", font=font_lighting, fill=white)

# Save to public/images/philips_home_lighting_logo.png
out_path = 'public/images/philips_home_lighting_logo.png'
img.save(out_path, 'PNG')
print("Successfully generated logo at:", out_path)

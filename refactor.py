import os
import re
import base64
from urllib.parse import unquote

input_file = '/Users/annycaroline/Downloads/bonvie_corrigido (61).html'
out_dir = '/Users/annycaroline/.gemini/antigravity/scratch/bonvie_refactor'
os.makedirs(out_dir, exist_ok=True)
os.makedirs(os.path.join(out_dir, 'images'), exist_ok=True)

with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 1. Fix the top base64 error: <html lan...
match = re.search(r'<html lan([A-Za-z0-9+/=]+)("|\s|>|lang="pt-BR">?)', content)
if match:
    b64_data = match.group(1)
    try:
        img_data = base64.b64decode(b64_data)
        with open(os.path.join(out_dir, 'images', 'image_top.jpg'), 'wb') as img_f:
            img_f.write(img_data)
        print(f"Extracted image_top.jpg, size: {len(img_data)} bytes")
    except Exception as e:
        print(f"Error decoding top image: {e}")
        
    content = content[:match.start()] + '<html lang="pt-BR">' + content[match.end():]

# 2. Extract other base64 images in img tags or css
img_idx = 1
def replace_b64_img(m):
    global img_idx
    ext_map = {'jpeg': 'jpg', 'png': 'png', 'gif': 'gif', 'svg+xml': 'svg', 'webp': 'webp'}
    mime = m.group(1)
    b64 = m.group(2)
    ext = ext_map.get(mime.lower(), 'jpg')
    filename = f'image_{img_idx}.{ext}'
    img_idx += 1
    
    try:
        img_data = base64.b64decode(b64)
        with open(os.path.join(out_dir, 'images', filename), 'wb') as img_f:
            img_f.write(img_data)
        print(f"Extracted {filename}")
        return f'src="images/{filename}"'
    except Exception as e:
        print(f"Error decoding {filename}: {e}")
        return m.group(0)

content = re.sub(r'src=["\']v?data:image/([^;]+);base64,([^"\']+)["\']', replace_b64_img, content)

# 3. Extract styles
styles = []
def extract_style(m):
    styles.append(m.group(1))
    return '<link rel="stylesheet" href="style.css">'

content = re.sub(r'<style[^>]*>(.*?)</style>', extract_style, content, flags=re.DOTALL | re.IGNORECASE)

if styles:
    with open(os.path.join(out_dir, 'style.css'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(styles))
    print("Extracted style.css")

# 4. Extract JS
scripts = []
def extract_script(m):
    attrs = m.group(1)
    code = m.group(2)
    if 'src=' not in attrs.lower() and code.strip():
        scripts.append(code)
        return '<script src="script.js"></script>'
    return m.group(0)

content = re.sub(r'<script([^>]*)>(.*?)</script>', extract_script, content, flags=re.DOTALL | re.IGNORECASE)

if scripts:
    with open(os.path.join(out_dir, 'script.js'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(scripts))
    print("Extracted script.js")

# Fix multiple links/scripts
content = re.sub(r'(<link rel="stylesheet" href="style.css">\s*)+', '<link rel="stylesheet" href="style.css">\n', content)
content = re.sub(r'(<script src="script.js"></script>\s*)+', '<script src="script.js"></script>\n', content)

# Write output
with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved index.html")

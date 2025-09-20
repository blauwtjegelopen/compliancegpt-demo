#!/usr/bin/env bash
set -euo pipefail

# ============= SETTINGS =============
VERSION="v1.1"
ROOT="$HOME/LayerZero_Build_${VERSION}"
PYENV="$ROOT/.venv"
echo "Building into: $ROOT"
mkdir -p "$ROOT"
cd "$ROOT"

# ============= TOOLS =============
# Use system python3, install venv & deps
if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 not found. Install Xcode CLT or Python first."; exit 1
fi

python3 -m venv "$PYENV"
source "$PYENV/bin/activate"
python3 -m pip install --upgrade pip
pip install pillow python-pptx reportlab

# ============= PYTHON BUILDER =============
cat > build_layerzero.py <<'PY'
import os, io, zipfile, textwrap
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

VERSION = "v1.1"
DATE = "September 2025"
BASE = os.getcwd()

# ---------- Helpers ----------
def ensure(p): os.makedirs(p, exist_ok=True)
def save_png(path, img): ensure(os.path.dirname(path)); img.save(path, format="PNG")

def cover_image(theme="light"):
    W,H=1920,1080
    bg = (255,255,255) if theme=="light" else (31,41,55)
    fg = (17,24,39) if theme=="light" else (255,255,255)
    teal=(6,182,212)
    img = Image.new("RGB",(W,H),bg)
    d = ImageDraw.Draw(img)
    cx,cy = int(W*0.75), int(H*0.5)
    for r,a in [(260,20),(200,30),(140,40)]:
        d.ellipse([cx-r,cy-r,cx+r,cy+r], outline=teal, width=8)
    d.ellipse([cx-12,cy-12,cx+12,cy+12], fill=teal)
    try: f = ImageFont.truetype("Helvetica.ttc", 72)
    except: f = ImageFont.load_default()
    t1="LayerZero"
    t2="The foundation of safe AI" if theme=="light" else "The foundation of safe AI"
    w1,h1 = d.textsize(t1,font=f)
    d.text(((W-w1)//2,int(H*0.34)), t1, fill=fg, font=f)
    try: f2 = ImageFont.truetype("Helvetica.ttc", 36)
    except: f2 = ImageFont.load_default()
    w2,h2 = d.textsize(t2,font=f2)
    d.text(((W-w2)//2,int(H*0.34)+84), t2, fill=fg, font=f2)
    return img

def mock_browser_screenshot(theme="light", title="Admin Dashboard"):
    W,H=1600,1000
    bg = (248,250,252) if theme=="light" else (31,41,55)
    chrome = (229,231,235) if theme=="light" else (55,65,81)
    fg = (17,24,39) if theme=="light" else (241,245,249)
    card = (255,255,255) if theme=="light" else (45,55,72)
    dfg = (107,114,128)
    img = Image.new("RGB",(W,H),bg)
    d = ImageDraw.Draw(img)
    # top bar
    d.rectangle([0,0,W,64], fill=chrome)
    for i,c in enumerate([(255,95,86),(255,189,46),(39,201,63)]):
        x=24+i*20; d.ellipse([x-6,32-6,x+6,32+6], fill=c)
    # address field
    d.rounded_rectangle([120,20,W-120,44], radius=12, fill=(236,236,236) if theme=="light" else (75,85,99))
    # body grid
    try: f = ImageFont.truetype("Helvetica.ttc", 28)
    except: f = ImageFont.load_default()
    d.text((40,84), title, fill=fg, font=f)
    # 3 KPI cards
    card_w, card_h = (W-80-40)//3, 150
    labels = ["PII Redactions","Blocked %","Active Users"]
    vals   = ["18,204","2.4%","1,874"]
    for i in range(3):
        x = 40 + i*(card_w+20)
        d.rounded_rectangle([x,140,x+card_w,140+card_h], radius=16, fill=card)
        d.text((x+20,160), labels[i], fill=dfg, font=f)
        d.text((x+20,200), vals[i], fill=fg, font=f)
    # table placeholder
    d.rounded_rectangle([40,320,W-40,H-40], radius=16, fill=card)
    d.text((64,344), "Activity Log (demo)", fill=dfg, font=f)
    return img

def write_pdf(path, text):
    c = canvas.Canvas(path, pagesize=letter)
    width,height = letter
    x, y = 72, height-72
    for line in text.splitlines():
        c.drawString(x,y,line)
        y -= 14
        if y < 72:
            c.showPage()
            y = height-72
    c.save()

def add_title(prs, title, subtitle=None):
    slide = prs.slides.add_slide(prs.slide_layouts[5])  # blank
    shapes=slide.shapes
    left,top,width,height = Inches(0.5), Inches(1.0), Inches(12.0), Inches(1.2)
    tx=shapes.add_textbox(left,top,width,height).text_frame
    tx.text = title
    tx.paragraphs[0].font.size = Pt(44)
    tx.paragraphs[0].font.bold = True
    if subtitle:
        st = shapes.add_textbox(left, top+Inches(1.0), width, Inches(0.8)).text_frame
        st.text = subtitle
        st.paragraphs[0].font.size = Pt(20)
        st.paragraphs[0].font.color.rgb = (80,80,80)
    return slide

def add_image(prs, path, caption=None):
    slide = prs.slides.add_slide(prs.slide_layouts[5])
    pic = slide.shapes.add_picture(path, Inches(0.75), Inches(1.2), width=Inches(12.0))
    if caption:
        tx = slide.shapes.add_textbox(Inches(0.75), Inches(0.5), Inches(12.0), Inches(0.6)).text_frame
        tx.text = caption
        tx.paragraphs[0].font.size = Pt(18)
    return slide

def add_kv_list(prs, title, items):
    slide = prs.slides.add_slide(prs.slide_layouts[5])
    tx = slide.shapes.add_textbox(Inches(0.75), Inches(0.8), Inches(6.0), Inches(5.0)).text_frame
    tx.text = title
    tx.paragraphs[0].font.size = Pt(28)
    for k,v in items:
        p = tx.add_paragraph()
        p.text = f"• {k}: {v}"
        p.level = 1
        p.font.size = Pt(18)
    return slide

def save_pptx(path, cover_tagline, screenshots):
    prs = Presentation()
    prs.slide_width = Inches(13.333)  # 16:9
    prs.slide_height= Inches(7.5)

    add_title(prs, "LayerZero", cover_tagline)
    add_kv_list(prs, "Problem → Solution", [
        ("Shadow AI risk", "Data loss, policy violations"),
        ("Solution", "Guardrails, redaction, audit, routing"),
        ("Outcome", "Safe, trackable, compliant AI at scale"),
    ])
    for cap, img in screenshots:
        add_image(prs, img, cap)
    add_kv_list(prs, "Pricing (Editable)", [
        ("Starter", "$X / mo • 25 seats"),
        ("Growth", "$Y / mo • 250 seats"),
        ("Enterprise", "Custom • SSO, DLP, Legal"),
    ])
    add_kv_list(prs, "Contact", [
        ("Email", "contact@layerzero.ai"),
        ("Website", "www.layerzero.ai"),
    ])
    prs.save(path)

# ---------- Build assets ----------
dirs = {
    "COVERS": os.path.join(BASE, "COVERS"),
    "ASSETS_LIGHT": os.path.join(BASE, "ASSETS/Screenshots/Light"),
    "ASSETS_DARK": os.path.join(BASE, "ASSETS/Screenshots/Dark"),
    "BRAND": os.path.join(BASE, "BRAND"),
    "DECKS": os.path.join(BASE, "DECKS"),
    "ONEP": os.path.join(BASE, "ONE-PAGERS"),
    "LOGOS": os.path.join(BASE, "BRAND/Logos")
}
for p in dirs.values(): os.makedirs(p, exist_ok=True)

# Cover previews
cover_light = cover_image("light"); cover_dark = cover_image("dark")
cover_light_path = os.path.join(BASE, "LAYERZERO_COVER_PREVIEW_LIGHT.PNG")
cover_dark_path  = os.path.join(BASE, "LAYERZERO_COVER_PREVIEW_DARK.PNG")
cover_light.save(cover_light_path, "PNG"); cover_dark.save(cover_dark_path, "PNG")

# Screenshots
admin_light = mock_browser_screenshot("light","Admin Dashboard")
admin_dark  = mock_browser_screenshot("dark","Admin Dashboard")
trust_light = mock_browser_screenshot("light","Trust & Compliance")
trust_dark  = mock_browser_screenshot("dark","Trust & Compliance")
admin_light_path = os.path.join(dirs["ASSETS_LIGHT"], "Admin.png"); admin_light.save(admin_light_path,"PNG")
trust_light_path = os.path.join(dirs["ASSETS_LIGHT"], "Trust.png"); trust_light.save(trust_light_path,"PNG")
admin_dark_path  = os.path.join(dirs["ASSETS_DARK"], "Admin.png"); admin_dark.save(admin_dark_path,"PNG")
trust_dark_path  = os.path.join(dirs["ASSETS_DARK"], "Trust.png"); trust_dark.save(trust_dark_path,"PNG")

# READMEs (TXT + minimal PDF, US Letter)
readme_txt = f"""LAYERZERO BRAND & SALES PACKAGE
VERSION {VERSION}

FOLDER STRUCTURE
----------------
/DECKS/
/ONE-PAGERS/
/BRAND/
/ASSETS/
/LINKS/

HOW TO USE
----------
- SALES DECK → CUSTOMER DEMOS AND PITCHES
- INVESTOR DECK → FUNDRAISING CONVERSATIONS
- QUICK PITCH → SHORT INTRODUCTIONS
- ONE-PAGERS → QUICK HANDOUTS/ATTACHMENTS
- BRAND GUIDELINES → COLORS, FONTS, LOGO USAGE

NOTES
-----
- PPTX & KEYNOTE FILES ARE EDITABLE
- COVER TAGLINES ARE EDITABLE
- SCREENSHOTS ARE CLEAN, MAC-STYLE

LICENSE & USAGE
---------------
LAYERZERO ASSETS ARE PROVIDED FOR INTERNAL USE, PARTNER DEMOS, AND INVESTOR COMMUNICATIONS ONLY.
"""
with open(os.path.join(BASE,"README.TXT"),"w") as f: f.write(readme_txt)
c = canvas.Canvas(os.path.join(BASE,"README.PDF"), pagesize=letter)
for i,line in enumerate(readme_txt.splitlines()): c.drawString(72, 720 - 14*i, line)
c.save()

# Brand Guidelines v1.1 (PDF)
brand_text = f"""LAYERZERO BRAND GUIDELINES — {VERSION}
LOGO • COLOR • TYPOGRAPHY • ICONS
TONE OF VOICE: CONFIDENT, CLEAR, COMPLIANCE-FIRST. REASSURING, EMPOWERING. SHORT, DECLARATIVE SENTENCES.
"""
write_pdf(os.path.join(dirs["BRAND"], "LayerZero_Brand_Guidelines.pdf"), brand_text)

# Simple Logos (SVG/PNGs minimal)
logo_svg = """<svg xmlns='http://www.w3.org/2000/svg' width='512' height='128'><rect width='512' height='128' fill='#111827'/><circle cx='64' cy='64' r='40' fill='#06B6D4'/><text x='128' y='80' fill='white' font-size='48' font-family='Arial'>LayerZero</text></svg>"""
with open(os.path.join(dirs["LOGOS"], "LAYERZERO_LOGO_FULL_DARK.SVG"),"w") as f: f.write(logo_svg)

# ---------- Build PPTX decks ----------
os.makedirs(dirs["DECKS"], exist_ok=True)

sales_pptx = os.path.join(dirs["DECKS"], "LayerZero_Deck_Sales.pptx")
invest_pptx= os.path.join(dirs["DECKS"], "LayerZero_Deck_Investor.pptx")
qp_pptx    = os.path.join(dirs["DECKS"], "LayerZero_Deck_QuickPitch.pptx")

save_pptx(sales_pptx, "Safely scale ChatGPT across your company", [
    ("Admin — KPIs", admin_light_path), ("Trust — Docs", trust_light_path)
])
save_pptx(invest_pptx, "The foundation of safe AI infrastructure", [
    ("Admin — KPIs", admin_light_path), ("Trust — Docs", trust_light_path)
])
save_pptx(qp_pptx, "Trusted AI, without the risks", [
    ("Admin — KPIs", admin_light_path)
])

# ---------- Build One-Pagers (PPTX) ----------
os.makedirs(dirs["ONEP"], exist_ok=True)
def save_onepager(path, tagline):
    prs = Presentation()
    prs.slide_width = Inches(8.27*1.2)   # Wide doc-like
    prs.slide_height= Inches(11.69*0.9)  # A4-ish proportions
    add_title(prs, "LayerZero — One-Pager", tagline)
    add_kv_list(prs, "Highlights", [
        ("Compliance Guardrails","Real-time redaction, policy enforcement"),
        ("Visibility & Audit","Logs, exports, approvals"),
        ("Deploy Fast","Drop-in for OpenAI/Azure/OpenAI APIs"),
    ])
    prs.save(path)

save_onepager(os.path.join(dirs["ONEP"], "LayerZero_OnePager_Sales.pptx"), "Safely scale ChatGPT across your company")
save_onepager(os.path.join(dirs["ONEP"], "LayerZero_OnePager_Investor.pptx"), "The foundation of safe AI infrastructure")

print("OK")
PY

python3 build_layerzero.py

# ============= OPTIONAL: PPTX → Keynote (.key) via AppleScript =============
if osascript -e 'id of application "Keynote"' >/dev/null 2>&1; then
  echo "Converting PPTX → Keynote..."
  KEYDIR="$ROOT/DECKS"
  mkdir -p "$KEYDIR"
  for ppt in "$ROOT/DECKS/"*.pptx "$ROOT/ONE-PAGERS/"*.pptx; do
    [ -e "$ppt" ] || continue
    key="${ppt%.pptx}.key"
    osascript <<OSA
tell application "Keynote"
  set theDoc to open POSIX file "$ppt"
  save theDoc in POSIX file "$key"
  close theDoc saving yes
end tell
OSA
  done
else
  echo "Keynote not installed or not accessible; skipping .key conversion."
fi

# ============= ZIPPING (v1.1) =============
echo "Packaging zips..."

# Common root assets at top-level of each zip:
# - README.TXT + README.PDF
# - LAYERZERO_COVER_PREVIEW_LIGHT.PNG
# - LAYERZERO_COVER_PREVIEW_DARK.PNG

zip -r -q "$ROOT/LayerZero_Decks_v1.1.zip" \
  "README.TXT" "README.PDF" \
  "LAYERZERO_COVER_PREVIEW_LIGHT.PNG" "LAYERZERO_COVER_PREVIEW_DARK.PNG" \
  "DECKS" "ONE-PAGERS" "BRAND" "ASSETS"

# Light subset (+ LINKS placeholder)
mkdir -p "$ROOT/LINKS"
echo "Sales, Investor, Quick Pitch, One-Pagers (Light)" > "$ROOT/LINKS/Google_Slides_Links.txt"

zip -r -q "$ROOT/LayerZero_Light_v1.1.zip" \
  "README.TXT" "README.PDF" \
  "LAYERZERO_COVER_PREVIEW_LIGHT.PNG" "LAYERZERO_COVER_PREVIEW_DARK.PNG" \
  "DECKS" "ONE-PAGERS" "BRAND" "ASSETS" "LINKS"

# Dark subset identical structure (keep for parity)
zip -r -q "$ROOT/LayerZero_Dark_v1.1.zip" \
  "README.TXT" "README.PDF" \
  "LAYERZERO_COVER_PREVIEW_LIGHT.PNG" "LAYERZERO_COVER_PREVIEW_DARK.PNG" \
  "DECKS" "ONE-PAGERS" "BRAND" "ASSETS"

# Logos-only zip (pull from BRAND/Logos)
cd "$ROOT/BRAND/Logos"
zip -r -q "$ROOT/LayerZero_Logos_v1.1.zip" .

echo "Done."

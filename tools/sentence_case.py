"""Apply the site's case rule (capital at sentence start only) to content headings,
titles, H1s, descriptions and link labels. Usage: python3 tools/sentence_case.py [--check] FILES..."""
import re, sys

# Proper nouns and acronyms that keep their capital mid-sentence.
PROPER = set("""Lyon Villeurbanne Rhône Google France Bron Vénissieux Caluire Cuire Écully Tassin Oullins Vaulx Velin
Saint Fons Priest Genis Laval Rillieux Pape Décines Charpieu Meyzieu Chassieu Sainte Foy Croix Rousse Part-Dieu
Confluence Gerland Monplaisir Montchat Brotteaux Presqu'île Presqu’île Vieux Grenoble Saint-Étienne Annecy
Bourg-en-Bresse Villefranche-sur-Saône Auvergne-Rhône-Alpes Rhône-Alpes Île-de-France Jean-Macé Flachet Tolstoï
Croix-Rousse Cal.com Web3Forms Plausible Maps Search Console Business Profile Poppins HA Ha Guillotière Gratte-Ciel
Saint-Etienne Etienne Étienne Lyonnais Villeurbannais ARS Cusset Charpennes Tonkin Bellecour Fourvière Mermoz Vaise Duchère Saône Isère Ain Loire Annemasse Asie Afrique Europe""".split())
WORD = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿŒœ'’.\-]+")
SEG = re.compile(r"((?:[.?!…]|\s[–—|])\s+)")  # sentence / title-segment boundaries

def fix_segment(seg):
    out, first, prev = [], True, ""
    for m in re.finditer(r"[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9'’.\-★/]+|[^A-Za-zÀ-ÖØ-öø-ÿŒœ0-9'’.\-★/]+", seg):
        tok = m.group(0)
        if WORD.fullmatch(tok) and tok[:1].isalpha():
            core = tok.strip("'’.-")
            if first:
                first = False
            elif core not in PROPER and not (core == "Nuisibles" and prev in ("Ha", "HA")):
                # lowercase each hyphen part unless it is an acronym (2+ capitals) or a proper noun
                tok = "-".join(w if (len(w) > 1 and re.sub(r"^[a-zA-Z]['’]", "", w).isupper()) or w.strip("'’.") in PROPER
                               or re.sub(r"^[a-zA-Z]['’]", "", w) in PROPER
                               else re.sub(r"^([a-zA-Z]['’])?(.)", lambda x: (x.group(1) or "").lower() + x.group(2).lower(), w)
                               for w in tok.split("-"))
            prev = core
        elif re.match(r"\d", tok):
            first = False
        out.append(tok)
    return "".join(out)

def fix_text(t):
    parts = SEG.split(t)
    return "".join(p if i % 2 else fix_segment(p) for i, p in enumerate(parts))

LINE = re.compile(r'^(#{1,6}\s+|(?:\s*-?\s*q|title|h1|description):\s*"?)(.*?)("?\s*)$')
LINK = re.compile(r"\[([^\]]+)\]\(")

def fix_line(l):
    m = LINE.match(l)
    if m:
        return m.group(1) + fix_text(m.group(2)) + m.group(3)
    return LINK.sub(lambda x: "[" + fix_text(x.group(1)) + "](", l)

def fix_file(text):
    return "\n".join(fix_line(l) for l in text.split("\n"))

if __name__ == "__main__":
    check = "--check" in sys.argv
    changed = 0
    for f in [a for a in sys.argv[1:] if a != "--check"]:
        s = open(f, encoding="utf-8").read(); n = fix_file(s)
        if n != s:
            changed += 1
            if not check: open(f, "w", encoding="utf-8").write(n)
            else: print(f)
    print(f"{changed} file(s) {'need fixing' if check else 'fixed'}")
    sys.exit(1 if check and changed else 0)

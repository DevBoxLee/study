"""Small trusted Markdown subset adapted from the supplied ZIP."""
import html
import re

def inline(text):
    parts=[]
    last=0
    pattern=r"\[([^\]]+)\]\((https?://[^)]+|#[a-z0-9-]+)\)|<(https?://[^>]+)>"
    for m in re.finditer(pattern,text):
        parts.append(html.escape(text[last:m.start()],quote=False))
        if m.group(3):
            raw_url=m.group(3)
            label=raw_url
        else:
            raw_url=m.group(2)
            label=m.group(1)
        url=html.escape(raw_url,quote=True)
        extra=' target="_blank" rel="noopener noreferrer"' if raw_url.startswith('http') else ''
        parts.append(f'<a href="{url}"{extra}>{html.escape(label)}</a>')
        last=m.end()
    parts.append(html.escape(text[last:],quote=False))
    text=''.join(parts)
    text=re.sub(r"`([^`]+)`",r"<code>\1</code>",text)
    text=re.sub(r"\*\*([^*]+)\*\*",r"<strong>\1</strong>",text)
    return text

def is_table_sep(line: str) -> bool:
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", c or "") for c in cells)


def split_table(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def markdown_to_html(md: str) -> str:
    lines = md.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    i = 0
    in_code = False
    code_buf: list[str] = []
    code_lang = ""

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            if not in_code:
                in_code = True
                code_lang = stripped[3:].strip()
                code_buf = []
            else:
                cls = f' class="language-{html.escape(code_lang, quote=True)}"' if code_lang else ""
                out.append(f"<pre><code{cls}>{html.escape(chr(10).join(code_buf))}</code></pre>")
                in_code = False
                code_lang = ""
                code_buf = []
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        if "|" in line and i + 1 < len(lines) and is_table_sep(lines[i + 1]):
            headers = split_table(line)
            i += 2
            rows: list[list[str]] = []
            while i < len(lines) and lines[i].strip() and "|" in lines[i]:
                rows.append(split_table(lines[i]))
                i += 1
            th = "".join(f"<th>{inline(c)}</th>" for c in headers)
            trs = []
            for row in rows:
                row = row + [""] * (len(headers) - len(row))
                trs.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row[: len(headers)]) + "</tr>")
            out.append('<div class="table-wrap"><table><thead><tr>' + th + "</tr></thead><tbody>" + "".join(trs) + "</tbody></table></div>")
            continue

        m = re.match(r"^(#{1,4})\s+(.+)$", stripped)
        if m:
            level = max(2, min(6, len(m.group(1))))
            out.append(f"<h{level}>{inline(m.group(2))}</h{level}>")
            i += 1
            continue

        if stripped.startswith("> "):
            items = []
            while i < len(lines) and lines[i].strip().startswith("> "):
                items.append(lines[i].strip()[2:])
                i += 1
            out.append("<blockquote>" + "<br>".join(inline(x) for x in items) + "</blockquote>")
            continue

        if re.match(r"^[-*]\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^\s*[-*]\s+", lines[i]):
                items.append(re.sub(r"^\s*[-*]\s+", "", lines[i]).strip())
                i += 1
            out.append("<ul>" + "".join(f"<li>{'<span aria-hidden=\"true\" class=\"check-square\">□</span> ' + inline(x[4:]) if x.startswith('[ ] ') else inline(x)}</li>" for x in items) + "</ul>")
            continue

        if re.match(r"^\d+\.\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^\s*\d+\.\s+", lines[i]):
                items.append(re.sub(r"^\s*\d+\.\s+", "", lines[i]).strip())
                i += 1
            out.append("<ol>" + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ol>")
            continue

        if stripped == "---":
            out.append("<hr>")
            i += 1
            continue

        para = [stripped]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if not nxt or nxt.startswith(("#", ">", "```")) or re.match(r"^[-*]\s+", nxt) or re.match(r"^\d+\.\s+", nxt):
                break
            if "|" in nxt and i + 1 < len(lines) and is_table_sep(lines[i + 1]):
                break
            para.append(nxt)
            i += 1
        out.append("<p>" + " ".join(inline(x) for x in para) + "</p>")

    if in_code:
        out.append("<pre><code>" + html.escape("\n".join(code_buf)) + "</code></pre>")
    return "\n".join(out)


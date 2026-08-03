from bs4 import BeautifulSoup
import re
import os
import json
import feedparser
from email.utils import parsedate_to_datetime

os.makedirs("docs", exist_ok=True)

feeds = {
    "PL": "https://www.pepper.pl/rss/new",
    "DE": "https://www.mydealz.de/rss/new",
    "AT": "https://www.preisjaeger.at/rss/new",
    "FR": "https://www.dealabs.com/rss/new",
    "ES": "https://www.chollometro.com/rss/new"
}

items = []

for cc, url in feeds.items():

    feed = feedparser.parse(url)
    print(cc, len(feed.entries))

    for e in feed.entries:

        html = e.get("description", "")
        txt = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)

        store = ""

        m = re.search(
            r"(Amazon(?:\.[a-z]+)?|Media\s?Markt|MediaMarkt|Saturn|W\.KRUK|Ceneo|Allegro|Empik|RTV\s?Euro\s?AGD|Media\s?Expert)",
            txt,
            re.I
        )

        if m:
            store = m.group(1)

        img = ""

        if "media_content" in e and e.media_content:
            img = e.media_content[0].get("url", "")
        elif "media_thumbnail" in e and e.media_thumbnail:
            img = e.media_thumbnail[0].get("url", "")

        try:
            ts = parsedate_to_datetime(e.published).timestamp()
        except:
            ts = 0

        items.append({
            "cc": cc,
            "store": store,
            "title": e.title,
            "link": e.link,
            "img": img,
            "time": e.get("published", ""),
            "timestamp": ts
        })

items.sort(key=lambda x: x["timestamp"], reverse=True)

with open("docs/feed.json", "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False)

print("Written", len(items), "items")

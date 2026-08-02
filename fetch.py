import os
import json
import feedparser
from email.utils import parsedate_to_datetime

os.makedirs("docs", exist_ok=True)

feeds = {
    "PL":"https://www.pepper.pl/rss/new",
    "DE":"https://www.mydealz.de/rss/new",
    "AT":"https://www.preisjaeger.at/rss/new",
    "FR":"https://www.dealabs.com/rss/new",
    "ES":"https://www.chollometro.com/rss/new"
}

items=[]

for cc,url in feeds.items():
    feed=feedparser.parse(url)
    print(cc,len(feed.entries))

    for e in feed.entries:

        img=""

        if "media_content" in e and e.media_content:
            img=e.media_content[0].get("url","")
        elif "media_thumbnail" in e and e.media_thumbnail:
            img=e.media_thumbnail[0].get("url","")

        try:
            ts=parsedate_to_datetime(e.published).timestamp()
        except:
            ts=0

        items.append({
            "cc":cc,
            "title":e.title,
            "link":e.link,
            "img":img,
            "time":e.get("published",""),
            "timestamp":ts
        })

items.sort(key=lambda x:x["timestamp"],reverse=True)

with open("docs/feed.json","w",encoding="utf-8") as f:
    json.dump(items,f,ensure_ascii=False)

print("Written",len(items),"items")

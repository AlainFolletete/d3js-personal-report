import xml.etree.ElementTree as ET
import requests
from dateutil.parser import parse
from dateutil import tz
from datetime import datetime
import csv


parameters = {
    'key' : 'RijHdX5x5GA4FSzktfbjdQ',
    'v' : '2',
    'sort' : 'date_started'
}
url = 'http://www.goodreads.com/review/list/13805829.xml'
header = ['title', 'date_start', 'date_end', 'rating', 'image_url']
r = requests.get(url, params=parameters)

root = ET.fromstring(unicode(r.text).encode('utf8'))
dt_read_at = datetime.now()

with open('../data/goodreads.csv', 'w') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(header)

    for review in root.findall('reviews/review'):
        read_at = review.find('read_at').text
        started_at = review.find('started_at').text

        if read_at:
            dt_read_at = parse(read_at).astimezone(tz.gettz('Europe/Paris'))

        if started_at:
            dt_started_at = parse(started_at).astimezone(tz.gettz('Europe/Paris'))

        title = review.find('book/title').text.replace(',', '')
        image_url = review.find('book/image_url').text
        rating = review.find('rating').text

        writer.writerow([title, dt_started_at.strftime('%Y-%m-%d'), dt_read_at.strftime('%Y-%m-%d'), rating, image_url])
import xml.etree.ElementTree as ET
import requests
from dateutil.parser import parse
from dateutil import tz


url = 'http://www.goodreads.com/review/list/13805829.xml?key=RijHdX5x5GA4FSzktfbjdQ&v=2&sort=date_started'
r = requests.get(url)

root = ET.fromstring(unicode(r.text).encode('utf8'))

for review in root.findall('reviews/review'):
	read_at = review.find('read_at').text
	started_at = review.find('started_at').text

#	if read_at:
		
#image_url, started_at, read_at, 
	print read_at, started_at
	print review.find('book/title').text

#date = parse('Sun Jan 13 04:31:18 -0800 2013')
#print date.astimezone(tz.gettz('Europe/Paris'))

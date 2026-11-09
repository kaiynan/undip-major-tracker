const query = `[out:json][timeout:90];
(
  way["building"](-7.062,110.430,-7.045,110.450);
  relation["building"](-7.062,110.430,-7.045,110.450);
  way["highway"](-7.062,110.430,-7.045,110.450);
  way["landuse"](-7.062,110.430,-7.045,110.450);
  way["leisure"](-7.062,110.430,-7.045,110.450);
  way["natural"="water"](-7.062,110.430,-7.045,110.450);
  way["amenity"](-7.062,110.430,-7.045,110.450);
  node["amenity"](-7.062,110.430,-7.045,110.450);
  node["name"](-7.062,110.430,-7.045,110.450);
  node["historic"](-7.062,110.430,-7.045,110.450);
);
out geom;`;

const endpoints = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];

async function main() {
  for (const endpoint of endpoints) {
    console.log(`Trying endpoint: ${endpoint}...`);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'User-Agent': 'UndipMajorMatcher/1.0'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(20000)
      });
      console.log('Response status:', res.status);
      if (res.ok) {
        const json = await res.json();
        console.log('Success! Elements count:', json.elements.length);
        const named = json.elements.filter(e => e.tags && e.tags.name);
        console.log('Named elements count:', named.length);
        return;
      } else {
        const text = await res.text();
        console.log('Error status:', res.status, text.slice(0, 150));
      }
    } catch (e) {
      console.log('Fetch error on', endpoint, e.name, e.message);
    }
  }
}

main().catch(console.error);

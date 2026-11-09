import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface OsmNode {
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OsmWay {
  id: string;
  nodeRefs: string[];
  tags: Record<string, string>;
}

interface OsmRelation {
  id: string;
  members: { type: string; ref: string; role: string }[];
  tags: Record<string, string>;
}

interface OsmRawElement {
  type: string;
  id: string | number;
  lat?: number;
  lon?: number;
  geometry?: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

async function parseOsmXml(filePath: string) {
  console.log(`Parsing OSM XML from: ${filePath}`);
  const nodes = new Map<string, OsmNode>();
  const ways: OsmWay[] = [];
  const relations: OsmRelation[] = [];

  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentEntity: 'node' | 'way' | 'relation' | null = null;
  let currentId: string = '';
  let currentNode: OsmNode | null = null;
  let currentWay: OsmWay | null = null;
  let currentRelation: OsmRelation | null = null;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Node start
    if (trimmed.startsWith('<node ')) {
      const idMatch = trimmed.match(/id="([^"]+)"/);
      const latMatch = trimmed.match(/lat="([^"]+)"/);
      const lonMatch = trimmed.match(/lon="([^"]+)"/);
      if (idMatch && latMatch && lonMatch) {
        currentId = idMatch[1];
        const lat = parseFloat(latMatch[1]);
        const lon = parseFloat(lonMatch[1]);
        if (trimmed.endsWith('/>')) {
          nodes.set(currentId, { lat, lon });
        } else {
          currentEntity = 'node';
          currentNode = { lat, lon, tags: {} };
        }
      }
      continue;
    }

    // Node end
    if (trimmed === '</node>') {
      if (currentEntity === 'node' && currentNode) {
        nodes.set(currentId, currentNode);
      }
      currentEntity = null;
      currentNode = null;
      continue;
    }

    // Way start
    if (trimmed.startsWith('<way ')) {
      const idMatch = trimmed.match(/id="([^"]+)"/);
      if (idMatch) {
        currentId = idMatch[1];
        currentEntity = 'way';
        currentWay = { id: currentId, nodeRefs: [], tags: {} };
      }
      continue;
    }

    // Way nd ref
    if (currentEntity === 'way' && trimmed.startsWith('<nd ')) {
      const refMatch = trimmed.match(/ref="([^"]+)"/);
      if (refMatch && currentWay) {
        currentWay.nodeRefs.push(refMatch[1]);
      }
      continue;
    }

    // Way end
    if (trimmed === '</way>') {
      if (currentEntity === 'way' && currentWay) {
        ways.push(currentWay);
      }
      currentEntity = null;
      currentWay = null;
      continue;
    }

    // Relation start
    if (trimmed.startsWith('<relation ')) {
      const idMatch = trimmed.match(/id="([^"]+)"/);
      if (idMatch) {
        currentId = idMatch[1];
        currentEntity = 'relation';
        currentRelation = { id: currentId, members: [], tags: {} };
      }
      continue;
    }

    // Relation member
    if (currentEntity === 'relation' && trimmed.startsWith('<member ')) {
      const typeMatch = trimmed.match(/type="([^"]+)"/);
      const refMatch = trimmed.match(/ref="([^"]+)"/);
      const roleMatch = trimmed.match(/role="([^"]*)"/);
      if (typeMatch && refMatch && currentRelation) {
        currentRelation.members.push({
          type: typeMatch[1],
          ref: refMatch[1],
          role: roleMatch ? roleMatch[1] : '',
        });
      }
      continue;
    }

    // Relation end
    if (trimmed === '</relation>') {
      if (currentEntity === 'relation' && currentRelation) {
        relations.push(currentRelation);
      }
      currentEntity = null;
      currentRelation = null;
      continue;
    }

    // Tags inside node, way, or relation
    if (trimmed.startsWith('<tag ')) {
      const kMatch = trimmed.match(/k="([^"]+)"/);
      const vMatch = trimmed.match(/v="([^"]*)"/);
      if (kMatch && vMatch) {
        const k = kMatch[1];
        const v = vMatch[1];
        if (currentEntity === 'node' && currentNode) {
          currentNode.tags = currentNode.tags || {};
          currentNode.tags[k] = v;
        } else if (currentEntity === 'way' && currentWay) {
          currentWay.tags[k] = v;
        } else if (currentEntity === 'relation' && currentRelation) {
          currentRelation.tags[k] = v;
        }
      }
    }
  }

  console.log(`Indexed ${nodes.size} nodes, ${ways.length} ways, ${relations.length} relations.`);

  // Convert to Overpass JSON structure
  const elements: OsmRawElement[] = [];

  // Nodes with relevant tags (amenities, landmarks)
  for (const [id, node] of nodes.entries()) {
    if (node.tags && Object.keys(node.tags).length > 0) {
      elements.push({
        type: 'node',
        id,
        lat: node.lat,
        lon: node.lon,
        tags: node.tags,
      });
    }
  }

  // Ways with resolved geometry
  for (const way of ways) {
    const geometry: { lat: number; lon: number }[] = [];
    for (const ref of way.nodeRefs) {
      const node = nodes.get(ref);
      if (node) {
        geometry.push({ lat: node.lat, lon: node.lon });
      }
    }
    if (geometry.length > 0) {
      elements.push({
        type: 'way',
        id: way.id,
        geometry,
        tags: way.tags,
      });
    }
  }

  // Multi-polygon relations (e.g. large buildings or campus areas)
  for (const rel of relations) {
    // If tagged as building or leisure or amenity
    if (rel.tags && (rel.tags.building || rel.tags.leisure || rel.tags.amenity || rel.tags.natural)) {
      // Find outer way geometry
      const outerMember = rel.members.find((m) => m.type === 'way' && m.role === 'outer') || rel.members.find((m) => m.type === 'way');
      if (outerMember) {
        const matchingWay = ways.find((w) => w.id === outerMember.ref);
        if (matchingWay) {
          const geometry: { lat: number; lon: number }[] = [];
          for (const ref of matchingWay.nodeRefs) {
            const node = nodes.get(ref);
            if (node) {
              geometry.push({ lat: node.lat, lon: node.lon });
            }
          }
          if (geometry.length > 0) {
            elements.push({
              type: 'relation',
              id: rel.id,
              geometry,
              tags: { ...matchingWay.tags, ...rel.tags },
            });
          }
        }
      }
    }
  }

  const outJson = {
    version: 0.6,
    generator: 'undip-major-matcher-osm-parser',
    osm3s: {
      timestamp_osm_base: new Date().toISOString(),
      copyright: 'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
    },
    elements,
  };

  const targetPath = path.join(path.dirname(filePath), 'osm-2026-11-09.json');
  fs.writeFileSync(targetPath, JSON.stringify(outJson, null, 2), 'utf8');
  console.log(`Saved ${elements.length} elements to ${targetPath}`);
}

const inputOsm = path.join(__dirname, '../map-data/raw/undip-tembalang.osm');
parseOsmXml(inputOsm).catch((err) => {
  console.error(err);
  process.exit(1);
});

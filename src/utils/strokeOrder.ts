export interface StrokePath {
  d: string;
  index: number;
}

export function parseKanjiVGSvg(svgText: string): StrokePath[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  const paths = doc.querySelectorAll('path[id]');
  const strokes: StrokePath[] = [];

  paths.forEach((path, i) => {
    const d = path.getAttribute('d');
    if (d) strokes.push({ d, index: i });
  });

  return strokes;
}

export function getPathLength(d: string): number {
  try {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const length = path.getTotalLength();
    document.body.removeChild(svg);
    return length;
  } catch {
    return 100;
  }
}

"""Generate gallery previews on macOS; retain full-resolution project originals."""
import concurrent.futures
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'dist/assets'
projects = json.loads((ROOT / 'dist/projects.json').read_text())

def resize(job):
    project_id, width = job
    source = ASSETS / f'project-{project_id}.webp'
    output = ASSETS / f'project-{project_id}-{width}.jpg'
    subprocess.run(['sips', '--resampleWidth', str(width), '-s', 'format', 'jpeg',
                    '-s', 'formatOptions', '68', str(source), '--out', str(output)],
                   check=True, capture_output=True)
    return output.stat().st_size

jobs = [(project['id'], width) for project in projects for width in (680, 1280)]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    sizes = list(pool.map(resize, jobs))
subprocess.run(['sips', '-Z', '650', str(ASSETS / 'portrait.png'), '--out',
                str(ASSETS / 'portrait-preview.png')], check=True, capture_output=True)
print(f'Generated {len(jobs)} responsive project images ({sum(sizes):,} bytes) and the portrait preview.')

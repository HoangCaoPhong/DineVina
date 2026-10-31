"""Create a portable PA2 archive and SHA-256 manifest from this package directory."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parent.parent
archive = root / 'PA2-Group08.zip'
manifest = root / 'SHA256SUMS.txt'

def included(path):
    relative = path.relative_to(root)
    return (path.is_file() and path not in (archive, manifest)
            and not any(x in relative.parts for x in ('node_modules', '__pycache__', '.git'))
            and path.suffix not in ('.pyc', '.tmp'))

files = sorted(p for p in root.rglob('*') if included(p))
manifest.write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  '
                          + p.relative_to(root).as_posix() + '\n' for p in files))
files.append(manifest)
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as stream:
    for file in files:
        stream.write(file, 'PA2-Group08/' + file.relative_to(root).as_posix())
with zipfile.ZipFile(archive) as stream:
    assert stream.testzip() is None, 'ZIP CRC check failed'
    assert all(name.startswith('PA2-Group08/') for name in stream.namelist())
    for line in stream.read('PA2-Group08/SHA256SUMS.txt').decode().splitlines():
        expected, name = line.split('  ', 1)
        assert hashlib.sha256(stream.read('PA2-Group08/' + name)).hexdigest() == expected, name
print(json.dumps({'archive': str(archive), 'files': len(files), 'bytes': archive.stat().st_size,
                  'crc': 'PASS', 'sha256': 'PASS', 'top_level': 'PA2-Group08/'}, indent=2))

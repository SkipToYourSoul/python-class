#!/usr/bin/env python3
"""Create a portable source archive without dependencies or build caches."""

from hashlib import sha256
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
DIRECTORIES = ("app", "components", "hooks", "lib", "public", "scripts")
FILES = (
    "package.json", "package-lock.json", "vite.config.ts", "next.config.ts",
    "tsconfig.json", "components.json", ".oxfmtrc.json",
    ".oxlintrc.json", ".gitignore", ".openai/hosting.json", "README.md",
    "部署与打包说明.md", "启动课程网站.command",
    "AGENTS.md", "COURSE_DESIGN_SYSTEM.md", "docs/COURSE_ENTRY_SPEC.md",
    "design-reviews/course-home-reference.png",
)
PREFIX = "ai-with-python-course"


def main():
    paths = [ROOT / name for name in FILES]
    for name in DIRECTORIES:
        paths.extend(path for path in (ROOT / name).rglob("*") if path.is_file())
    paths = sorted(set(paths))
    paths = [path for path in paths if not any(
        part in {".DS_Store", "__pycache__"} or part.startswith(".env")
        or part.endswith((".pyc", ".log", ".tsbuildinfo"))
        for part in path.relative_to(ROOT).parts
    )]
    for path in paths:
        if not path.is_file():
            raise FileNotFoundError(path)
        if path.is_symlink():
            raise ValueError(f"Do not package symlinks: {path}")
    output = ROOT / "release"
    output.mkdir(exist_ok=True)
    archive = output / "ai-with-python-source.zip"
    temporary = output / "ai-with-python-source.zip.tmp"
    with ZipFile(temporary, "w", ZIP_DEFLATED, compresslevel=6) as bundle:
        for path in paths:
            bundle.write(path, f"{PREFIX}/{path.relative_to(ROOT).as_posix()}")
    with ZipFile(temporary) as bundle:
        bad = bundle.testzip()
        if bad:
            raise ValueError(f"Archive CRC failed: {bad}")
        for path in paths:
            member = f"{PREFIX}/{path.relative_to(ROOT).as_posix()}"
            if sha256(bundle.read(member)).digest() != sha256(path.read_bytes()).digest():
                raise ValueError(f"Archive content differs: {member}")
    temporary.replace(archive)
    checksum = sha256(archive.read_bytes()).hexdigest()
    (output / "ai-with-python-source.zip.sha256").write_text(
        f"{checksum}  {archive.name}\n", encoding="utf-8"
    )
    print(f"Archive: {archive}")
    print(f"Files: {len(paths)}")
    print(f"Source: {sum(path.stat().st_size for path in paths) / 1024**2:.1f} MiB")
    print(f"ZIP: {archive.stat().st_size / 1024**2:.1f} MiB")
    print("Verified: CRC and SHA-256 content comparison for every file")


if __name__ == "__main__":
    main()

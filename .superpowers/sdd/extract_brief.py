import re
import pathlib
import sys

plan_path = pathlib.Path(sys.argv[1])
n = int(sys.argv[2])
out_path = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else pathlib.Path(f".superpowers/sdd/task-{n}-brief.md")

plan = plan_path.read_text(encoding="utf-8")
lines = plan.splitlines(True)
out = []
intask = False
infence = False
for line in lines:
    if line.startswith("```"):
        infence = not infence
    if not infence and re.match(r"^#+[ \t]+Task[ \t]+\d+", line):
        intask = bool(re.match(rf"^#+[ \t]+Task[ \t]+{n}([^0-9]|$)", line))
    if intask:
        out.append(line)

out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text("".join(out), encoding="utf-8")
if not out:
    raise SystemExit(f"task {n} not found in {plan_path}")
print(f"wrote {out_path}: {len(out)} lines")

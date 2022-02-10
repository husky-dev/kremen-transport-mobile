import os
import json
from typing import Tuple
from utils import critical_err

Version = Tuple[int, int, int]

def get_version():
  package_file_path = os.getcwd() + "/package.json"
  if not(os.path.exists(package_file_path)):
    critical_err('"package.json" file not found')
  f = open(package_file_path)
  data = json.load(f)
  if "version" not in data:
    critical_err('"version" key was not found at the "package.json" file')
  f.close()
  version_str = data["version"]
  return parse_version(version_str)

def parse_version(val: str) -> Version:
  parts = val.split(".")
  assert len(parts) == 3
  return (int(parts[0]), int(parts[1]), int(parts[2]))
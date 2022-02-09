#!/usr/bin/env python3
import os
import sys
import json
import plistlib
import re
from unicodedata import numeric

# Types

Version = tuple[int, int, int]

# Utils

def critical_err(msg):
  print(msg)
  sys.exit(1)

def pad(val: str, size: int = 3):
  while len(val) < size: val = "0" + val
  return val

# Package

def parse_package_version(val: str) -> Version:
  parts = val.split(".")
  assert len(parts) == 3
  return (int(parts[0]), int(parts[1]), int(parts[2]))

def get_package_version():
  package_file_path = os.getcwd() + "/package.json"
  if not(os.path.exists(package_file_path)):
    critical_err('"package.json" file not found')
  f = open(package_file_path)
  data = json.load(f)
  if "version" not in data:
    critical_err('"version" key was not found at the "package.json" file')
  f.close()
  version_str = data["version"]
  return parse_package_version(version_str)

# iOS

def ios_set_version(ver: Version):
  print("[ios]: setting version to ", ver)
  bundle_short_version = "{0}.{1}".format(ver[0], ver[1])
  bundle_version = str(ver[2])
  print("[ios]: CFBundleShortVersionString", bundle_short_version)
  print("[ios]: CFBundleVersion", bundle_version)
  plist_file_path = os.getcwd() + "/ios/KremenTransport/Info.plist"
  f = open(plist_file_path, 'rb')
  data = plistlib.load(f)
  f.close()
  data["CFBundleShortVersionString"] = bundle_short_version
  data["CFBundleVersion"] = bundle_version
  f = open(plist_file_path, 'wb')
  plistlib.dump(data, f)
  f.close()

# Android

def and_set_version(ver: Version):
  print("[android]: setting version to", ver)
  ver_name = '{0}.{1}'.format(ver[0], ver[1])
  ver_code = and_version_to_code(ver)
  print("[android]: version name", ver_name)
  print("[android]: version code", ver_code)
  gradle_file_path = os.getcwd() + "/android/app/build.gradle"
  with open(gradle_file_path, 'r+') as f:
    content = f.read()
    content = re.sub('versionName ".+?"', 'versionName "{0}"'.format(ver_name), content)
    content = re.sub('versionCode \d+', 'versionCode {0}'.format(ver_code), content)
    f.seek(0)
    f.write(content)
    f.truncate()
    f.close()

def and_version_to_code(ver: Version):
  return str(ver[0]) + pad(str(ver[1]), 3) + pad(str(ver[2]), 3)

# Processing

def main():
  ver = get_package_version()
  print("package version:", ver)
  ios_set_version(ver)
  and_set_version(ver)

if __name__ == "__main__":
  main()

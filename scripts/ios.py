#!/usr/bin/env python3
import os
import plistlib
from typing import Tuple

Version = Tuple[int, int, int]

def set_version(ver: Version):
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
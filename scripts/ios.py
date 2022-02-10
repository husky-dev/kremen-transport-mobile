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
  data = get_plist_data()
  data["CFBundleShortVersionString"] = bundle_short_version
  data["CFBundleVersion"] = bundle_version
  set_plist_data(data)

def set_codepush_deployment_key(val: str):
  print("[ios]: setting CodePush deployment key:", val)
  data = get_plist_data()
  data["CodePushDeploymentKey"] = val
  set_plist_data(data)

def get_plist_data():
  f = open(get_plist_file_path(), 'rb')
  data = plistlib.load(f)
  f.close()
  return data

def set_plist_data(data):
  f = open(get_plist_file_path(), 'wb')
  plistlib.dump(data, f)
  f.close()

def get_plist_file_path() -> str:
  return  os.getcwd() + "/ios/KremenTransport/Info.plist"
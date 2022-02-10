import os
import re
from typing import Tuple
from utils import pad

Version = Tuple[int, int, int]

def set_version(ver: Version):
  print("[android]: setting version to", ver)
  ver_name = '{0}.{1}'.format(ver[0], ver[1])
  ver_code = version_to_code(ver)
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

def version_to_code(ver: Version):
  return str(ver[0]) + pad(str(ver[1]), 3) + pad(str(ver[2]), 3)

def set_google_maps_key(val: str):
  print("[android]: setting Google Maps key:", val)
  file_path = os.getcwd() + "/android/app/src/main/AndroidManifest.xml"
  with open(file_path, 'r+') as f:
    content = f.read()
    content = re.sub('android:name="com.google.android.geo.API_KEY"[\s\S]+?android:value=".+?"', 'android:name="com.google.android.geo.API_KEY" android:value="{0}"'.format(val), content)
    f.seek(0)
    f.write(content)
    f.truncate()
    f.close()

def set_codepush_deployment_key(val: str):
  print("[android]: setting CodePush deployment key:", val)
  file_path = os.getcwd() + "/android/app/src/main/res/values/strings.xml"
  with open(file_path, 'r+') as f:
    content = f.read()
    content = re.sub('"CodePushDeploymentKey">.+?<', '"CodePushDeploymentKey">{0}<'.format(val), content)
    f.seek(0)
    f.write(content)
    f.truncate()
    f.close()
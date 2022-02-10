#!/usr/bin/env python3
import ios
import android
import sys

def main():
  for arg in sys.argv:
    if arg.startswith("--google-map-key="):
      key = arg[len("--google-map-key="):]
      android.set_google_maps_key(key)
    if arg.startswith("--codepush-deployment-key="):
      key = arg[len("--codepush-deployment-key="):]
      android.set_codepush_deployment_key(key)

if __name__ == "__main__":
  main()

#!/usr/bin/env python3
import ios
import android
import package

def main():
  ver = package.get_version()
  print("package version:", ver)
  ios.set_version(ver)
  android.set_version(ver)

if __name__ == "__main__":
  main()

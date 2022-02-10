import sys

def critical_err(msg):
  print(msg)
  sys.exit(1)

def pad(val: str, size: int = 3):
  while len(val) < size: val = "0" + val
  return val

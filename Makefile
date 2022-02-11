version-sync:
	./scripts/version_sync.py

android-build:
	cd android && ./gradlew bundleRelease

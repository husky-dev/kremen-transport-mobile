version-sync:
	./scripts/version_sync.py

build-android:
	cd android && ./gradlew bundleRelease

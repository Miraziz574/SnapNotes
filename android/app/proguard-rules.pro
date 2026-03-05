# Default ProGuard rules for QuickNotes Android app
# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep class com.quicknotes.app.** { *; }

# Keep annotations
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**

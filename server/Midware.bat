@echo off
java -Djava.library.path=./server/lib/x64 \
-cp "./server/lib/Java/*" \
com.yourcompany.FingerprintService
Echo.
pause
@echo off
echo ===================================================
echo     HireSphere Java Backend Compilation & Launch
echo ===================================================

cd /d "%~dp0"

if not exist bin mkdir bin

echo Compiling Java source files...
javac -cp "lib/*" -d bin ^
  src/com/hiresphere/DatabaseConnection.java ^
  src/com/hiresphere/model/User.java ^
  src/com/hiresphere/model/CandidateProfile.java ^
  src/com/hiresphere/model/UserMessage.java ^
  src/com/hiresphere/model/DriveApplication.java ^
  src/com/hiresphere/model/Project.java ^
  src/com/hiresphere/dao/UserDao.java ^
  src/com/hiresphere/dao/ProfileDao.java ^
  src/com/hiresphere/dao/MessageDao.java ^
  src/com/hiresphere/dao/DriveApplicationDao.java ^
  src/com/hiresphere/dao/ProjectDao.java ^
  src/com/hiresphere/dao/AdminDao.java ^
  src/com/hiresphere/server/HireSphereServer.java

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b %ERRORLEVEL%
)

echo Compilation successful. Starting HireSphere Server on port 8085...
java -cp "bin;lib/*" com.hiresphere.server.HireSphereServer 8085

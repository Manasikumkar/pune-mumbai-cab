@REM Maven Wrapper startup script for Windows
@REM Usage: mvnw.cmd <goals> <options>

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"
set "MAVEN_WRAPPER_DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if not defined JAVA_HOME (
    where java >nul 2>nul
    if errorlevel 1 (
        echo Error: JAVA_HOME is not set and no java command could be found. >&2
        exit /b 1
    )
)

if not exist "%MAVEN_WRAPPER_JAR%" (
    echo Downloading Maven Wrapper...
    mkdir "%MAVEN_PROJECTBASEDIR%.mvn\wrapper" 2>nul
    powershell -Command "Invoke-WebRequest -Uri '%MAVEN_WRAPPER_DOWNLOAD_URL%' -OutFile '%MAVEN_WRAPPER_JAR%'"
)

for /f "tokens=1,* delims==" %%a in ('findstr /i "distributionUrl" "%MAVEN_WRAPPER_PROPERTIES%"') do set "MAVEN_DIST_URL=%%b"
set "MAVEN_DIST_URL=%MAVEN_DIST_URL: =%"
set "MAVEN_DIST_URL=%MAVEN_DIST_URL:/=\%"

set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Maven 3.9.6...
    mkdir "%MAVEN_HOME%" 2>nul
    set "TEMP_FILE=%TEMP%\maven-dist.zip"
    powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '%TEMP_FILE%'"
    powershell -Command "Expand-Archive -Path '%TEMP_FILE%' -DestinationPath '%MAVEN_HOME%' -Force"
    del "%TEMP_FILE%" 2>nul
)

"%MAVEN_HOME%\bin\mvn.cmd" %*

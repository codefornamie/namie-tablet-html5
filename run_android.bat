@echo off

echo Start running application
set current=%~dp0
echo current directory: %current%

cd %current%\www_dev
echo change directory: %current%\www_dev

echo run grunt tasks.
cmd /c grunt skipTests

IF NOT %ERRORLEVEL%==0 GOTO ERROR

echo obtain mode.json contents.
set /P mode=<mode.json
echo mode.json: %mode%

IF "%mode%" == "{"mode": "news"}" (
    set mode=news
) ELSE IF "%mode%" == "{"mode": "dojo"}" (
    set mode=dojo
} ELSE IF "%mode%" == "{"mode": "letter"}" (
    set mode=letter
} ELSE IF "%mode%" == "{"mode": "posting"}" (
    set mode=posting
} ELSE (
    echo unknwon mode.
    cd $current
    exit /b 1
)

echo application mode: %mode%
echo start cordova run for namie-tablet-%mode%
cd %current%
cd cordova\%mode%
cmd /c cordova run android

:ERROR

cd $current

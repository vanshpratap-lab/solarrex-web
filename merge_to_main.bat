@echo off
echo === SOLARREX MERGE AUTOMATION ===
echo Detecting remote repository...

git remote | findstr /R "^target$" >nul 2>&1
if %errorlevel% equ 0 (
    set REMOTE_NAME=target
) else (
    set REMOTE_NAME=origin
)

echo Target remote detected as: %REMOTE_NAME%

echo Detecting main branch...
git rev-parse --verify main >nul 2>&1
if %errorlevel% equ 0 (
    set MAIN_BRANCH=main
) else (
    set MAIN_BRANCH=master
)

echo Target main branch detected as: %MAIN_BRANCH%
echo.
echo Checkout target branch...
git checkout %MAIN_BRANCH%
if %errorlevel% neq 0 goto error

echo Pulling latest changes...
git pull %REMOTE_NAME% %MAIN_BRANCH%
if %errorlevel% neq 0 goto error

echo Merging Rudra branch...
git merge Rudra --no-ff -m "Merge branch 'Rudra' into %MAIN_BRANCH%"
if %errorlevel% neq 0 goto error

echo Pushing merged changes to remote...
git push %REMOTE_NAME% %MAIN_BRANCH%
if %errorlevel% neq 0 goto error

echo.
echo === MERGE COMPLETED SUCCESSFULLY ===
pause
exit /b 0

:error
echo.
echo [ERROR] Merge process failed. Please resolve conflicts or check git configuration.
pause
exit /b 1

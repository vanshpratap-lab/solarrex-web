@echo off
echo === SOLARREX MERGE AUTOMATION ===
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
git pull origin %MAIN_BRANCH%
if %errorlevel% neq 0 goto error

echo Merging Rudra branch...
git merge Rudra --no-ff -m "Merge branch 'Rudra' into %MAIN_BRANCH%"
if %errorlevel% neq 0 goto error

echo Pushing merged changes to remote...
git push origin %MAIN_BRANCH%
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

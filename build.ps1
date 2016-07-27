cd build
npm install
electron-packager.cmd . --platform=win32 --arch=x64 --version=1.3.0 --out='../release' --overwrite --icon='../assert/img/logo.ico' --asar=true   EditMarkdown
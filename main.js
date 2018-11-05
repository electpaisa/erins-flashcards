const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
    mainWindow.on("close", (e) => {
        app.quit();
    })
});

const mainMenuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click() { app.quit(); }
        }]
},
{
    label: 'View',
    submenu: [{
        label: "Zoom In",
        accelerator: 'CmdOrCtrl+=',
        click () {
            mainWindow.webContents.getZoomFactor((currentZoomFactor) => {
                let newZoomFactor = Math.min(2.0, currentZoomFactor + 0.2);
                mainWindow.webContents.setZoomFactor(newZoomFactor);
            });
        }
    },{
        label: "Zoom Out",
        accelerator: 'CmdOrCtrl+-',
        click() { 
            mainWindow.webContents.getZoomFactor((currentZoomFactor) => {
                let newZoomFactor = Math.max(0.5, currentZoomFactor - 0.2);
                mainWindow.webContents.setZoomFactor(newZoomFactor);
            });
        }
    }]
},
{
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
}]

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push(
        {
            label: 'Dev Tools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: "CmdOrCtrl+I",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        },
    )
}
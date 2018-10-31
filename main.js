const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function() {
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

// function createAddWindow() {

// }

const mainMenuTemplate = [{
    label: 'File',
    submenu:[
    //     {
    //     label: 'Add Item',
    // },
    // {
    //     label : 'Clear Items',
    // },
    {
        label:'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {app.quit();}
    }]
}]

if (process.platform == 'darwin'){
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
        ]}
    )
}
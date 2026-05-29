const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('aiworldStudio', {
  platform: process.platform,
  version: process.versions.electron,
});

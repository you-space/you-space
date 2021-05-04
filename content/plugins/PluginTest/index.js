class Plugin {
  service;

  start(){
    this.service.registerProvider('youtube-provider', './PluginTest/Provider.js')
  }

  stop(){
    this.service.unregisterProvider('youtube-provider')
  }
}

module.exports = Plugin
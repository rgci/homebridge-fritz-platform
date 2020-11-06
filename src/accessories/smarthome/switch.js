'use strict';

const Logger = require('../../helper/logger.js');

class extrasService {

  constructor (api, accessory, handler) {
    
    this.api = api;
    this.accessory = accessory;
    
    this.handler = handler;
    
    this.getService();

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  // Services
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  getService () {
  
    let service = this.accessory.getService(this.api.hap.Service.Switch);
    let serviceOld = this.accessory.getService(this.api.hap.Service.Outlet);
    
    if(serviceOld){
      Logger.info('Removing outlet', this.accessory.displayName);
      this.accessory.removeService(serviceOld);
    }
        
    if(!service){
      Logger.info('Adding switch', this.accessory.displayName);
      service = this.accessory.addService(this.api.hap.Service.Switch, this.accessory.displayName, this.accessory.context.config.subtype);
    }
    
    if(this.accessory.context.polling.timer && (!this.accessory.context.polling.exclude.includes(this.accessory.context.config.type) && !this.accessory.context.polling.exclude.includes(this.accessory.context.config.subtype) && !this.accessory.context.polling.exclude.includes(this.accessory.displayName))){
 
      service.getCharacteristic(this.api.hap.Characteristic.On)
        .on('set', this.handler.set.bind(this, this.accessory, this.api.hap.Service.Switch, this.api.hap.Characteristic.On, 'smarthome-switch', this.accessory.context.config.options));
 
 
    } else {
 
      service.getCharacteristic(this.api.hap.Characteristic.On)
        .on('get', this.handler.get.bind(this, this.accessory, this.api.hap.Service.Switch, this.api.hap.Characteristic.On, 'smarthome-switch', this.accessory.context.config.options))
        .on('set', this.handler.set.bind(this, this.accessory, this.api.hap.Service.Switch, this.api.hap.Characteristic.On, 'smarthome-switch', this.accessory.context.config.options));
 
    }
    
  }

}

module.exports = extrasService;
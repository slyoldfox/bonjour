'use strict'

var os = require('os')
var serviceName = require('multicast-dns-service-types')
var mdns = require('./mdns')

var TLD = '.local'
var hostname = os.hostname()

var Service = module.exports = function (opts) {
  this.name = opts.name || hostname.replace(/\.local\.?$/, '')
  this.type = serviceName.stringify(opts.type, opts.protocol)
  this.port = opts.port
  this.fqdn = this.name + '.' + this.type + TLD, // TODO: Encode illegal chars in name
  this.txt = opts.txt
  this.published = true
}

Service.prototype.records = function () {
  return [rr_ptr(this), rr_srv(this), rr_txt(this)]
}

function rr_ptr (service) {
  return {
    name: service.type + TLD,
    type: 'PTR',
    ttl: 28800,
    data: service.fqdn
  }
}

function rr_srv (service) {
  return {
    name: service.fqdn,
    type: 'SRV',
    ttl: 120,
    data: {
      port: service.port,
      target: hostname
    }
  }
}

function rr_txt (service) {
  return {
    name: service.fqdn,
    type: 'TXT',
    ttl: 4500,
    data: service.txt
  }
}
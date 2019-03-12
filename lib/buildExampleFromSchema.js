'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Mock = require('mockjs');

function buildExampleFromSchema(schema) {
  if (schema.example && _typeof(schema.example) === 'object') {
    return Mock.mock(schema.example);
  }
  var example = {};
  schema.params.forEach(function (param) {
    if (!param.key) return;
    // 简单值使用example，含有子集的结构需要单独处理
    var simpleType = ['number', 'boolean', 'string'];
    if (simpleType.includes(param.key) && (param.example || param.example === false)) {
      example[param.key] = param.example;
    } else {
      example[param.key] = buildExample(param);
    }
  });
  return Mock.mock(example);
};
function buildExample(param) {
  switch (param.type) {
    case 'object':
      return buildExampleFromSchema(param);
    case 'array':
      return [buildExample(param.items)];
    case 'number':
      return Math.ceil(Math.random() * 10000);
    case 'boolean':
      return Math.ceil(Math.random() * 2) > 1;
    default:
      return 'value';
  }
};
module.exports = buildExampleFromSchema;
/**
 ** Developed by Xcrowzz
 ** On 31/07/2019
 ** For project poc_newsletters
 ** Copyright (c) 2018-2019. All rights reserved.
 */

const Xlog = async (message, _type) => {
  const d = new Date();
  const date = `${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`;
  const definedTypes = ['ERR', 'WAR', 'DBG', 'INF'];
  const type = (_type && definedTypes.includes(_type)) ? _type : '*';
  console.log(`[${type}]: ${date} - ${message}`);
};

module.exports = {
  Xlog,
};

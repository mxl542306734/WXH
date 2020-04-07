let Parser = require("plugins/xmlParse/dom_parser.js");
let loadXML = function(xmlString){
  let XMLParser = new Parser.DOMParser();
  let doc = XMLParser.parseFromString(xmlString);
  let filtterData ={};
  try{
    filtterData = JSON.parse(doc.getElementsByTagName("return")[0].firstChild.nodeValue);
  }catch(e){

  }
  return filtterData;
}
module.exports = loadXML
const urlList = {
  infiniteScroll: "http://the-internet.herokuapp.com/infinite_scroll",
  checkBoxes: "http://the-internet.herokuapp.com/checkboxes",
  dropDown: "http://the-internet.herokuapp.com/dropdown",
  login: "http://the-internet.herokuapp.com/login",
  tables: "http://the-internet.herokuapp.com/tables"
};

const pathList = {
  lastNames: "//table[@id='table1']/tbody/tr/td[1]",
  firstNames: "//table[@id='table1']/tbody/tr/td[2]",
  emails: "//table[@id='table1']/tbody/tr/td[3]",
  dues: "//table[@id='table1']/tbody/tr/td[4]",
  websites: "//table[@id='table1']/tbody/tr/td[5]"
};

module.exports = class Locator {
  static getUrl(destination) {
    return urlList[destination];
  }

  static getElementsPath(target) {
    return pathList[target];
  }
};

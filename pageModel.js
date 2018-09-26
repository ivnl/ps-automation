require("chromedriver");
const webdriver = require("selenium-webdriver");
const { By, until } = webdriver;

module.exports = class Page {
  static async loadPage(driver, url) {
    await driver.get(url);
  }

  static async login(driver, user, password) {
    await driver
      .findElement(By.id("username"))
      .sendKeys(user)
      .then(() => driver.findElement(By.id("password")).sendKeys(password))
      .then(() => driver.findElement(By.id("login")).submit());
  }

  static async logout(driver) {
    await driver.findElement(By.xpath("//a[@href='/logout']")).click();
  }

  static async getFormVerifyElement(driver) {
    return await driver
      .findElement(By.xpath("//div[@id='content']/div/h2"))
      .getAttribute("innerText");
  }

  static async getTableElements(driver, path) {
    return await driver.findElements(By.xpath(path)).then(elements => {
      let promiseArray = [];

      elements.forEach(el => {
        promiseArray.push(el.getText());
      });

      return Promise.all(promiseArray).then(result => result);
    });
  }
};

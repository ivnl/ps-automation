require("chromedriver");
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
const { By, until } = webdriver;

const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));
chai.use(require("chai-match"));

const pageModel = require("./pageModel.js");
const locatorStore = require("./locatorStore.js");

describe("Form Authentication Tests", () => {
  before(() => {
    //mocha will wait until a promise is resolved before continuing!!
    pageModel.loadPage(driver, locatorStore.getUrl("login"));
  });

  it("successfully logs in using the form", async () => {
    await pageModel.login(driver, "tomsmith", "SuperSecretPassword!");
    const element = await pageModel.getFormVerifyElement(driver);
    expect(element).to.equal("Secure Area");
  });

  it("successfully logs out", async () => {
    await pageModel.logout(driver);
    const element = await pageModel.getFormVerifyElement(driver);
    expect(element).to.equal("Login Page");
  });
});

describe("Sortable Table Tests", () => {
  before(() => {
    pageModel.loadPage(driver, locatorStore.getUrl("tables"));
  });

  it("sorts last names correctly in alphabetical order upon clicking the 'last names' heading", async () => {
    await driver.findElement(By.xpath("//span[text()='Last Name']")).click();

    await pageModel
      .getTableElements(driver, locatorStore.getElementsPath("lastNames"))
      .then(result => expect(result).to.be.sorted());
  });

  it("contains appropriate characters for 'first name' column", async () => {
    await pageModel
      .getTableElements(driver, locatorStore.getElementsPath("firstNames"))
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^[a-zA-Z]+$/);
        });
      });
  });

  it("contains appropriate characters for 'email' column", async () => {
    await pageModel
      .getTableElements(driver, locatorStore.getElementsPath("emails"))
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+(.com|.net)$/);
        });
      });
  });

  it("contains appropriate characters for 'due' column", async () => {
    await pageModel
      .getTableElements(driver, locatorStore.getElementsPath("dues"))
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^\$[0-9]+\.[0-9][0-9]$/);
        });
      });
  });

  it("contains appropriate characters for 'web site' column", async () => {
    await pageModel
      .getTableElements(driver, locatorStore.getElementsPath("websites"))
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^http:\/\/www\.[a-zA-Z0-9-]+\.com$/);
        });
      });
  });

  after(() => {
    driver.quit();
  });
});

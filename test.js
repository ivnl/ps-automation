require("chromedriver");
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
const { By, until } = webdriver;

const chai = require("chai");
const expect = chai.expect;

chai.use(require("chai-sorted"));
chai.use(require("chai-match"));

// TODO: update to use page object pattern :( ... sorry for the messy look!

describe("Form Authentication Tests", () => {
  before(() => {
    driver.get("http://the-internet.herokuapp.com/login");
  });

  it("successfully logs in using the form", async () => {
    await driver
      .findElement(By.id("username"))
      .sendKeys("tomsmith")
      .then(() =>
        driver.findElement(By.id("password")).sendKeys("SuperSecretPassword!")
      )
      .then(() => driver.findElement(By.id("login")).submit())
      .then(() => {
        driver.wait(until.elementLocated(By.id("flash")));
      });

    const heading = await driver
      .findElement(By.xpath("//div[@id='content']/div/h2"))
      .getAttribute("innerText");

    expect(heading).to.equal("Secure Area");
  });

  it("successfully logs out", async () => {
    await driver
      .findElement(By.xpath("//a[@href='/logout']"))
      .click()
      .then(() => {
        driver.wait(
          until.elementTextContains(
            driver.findElement(By.xpath("//div[@id='content']/div/h2")),
            "Login Page"
          )
        );
      });

    const heading = await driver
      .findElement(By.xpath("//div[@id='content']/div/h2"))
      .getAttribute("innerText");

    expect(heading).to.equal("Login Page");
  });
});

describe("Sortable Table Tests", () => {
  before(() => {
    driver.get("http://the-internet.herokuapp.com/tables");
    driver.wait(
      until.elementTextContains(
        driver.findElement(By.xpath("//h3")),
        "Data Tables"
      )
    );
  });

  it("sorts last names correctly in alphabetical order upon clicking the 'last names' heading", async () => {
    await driver
      .wait(
        until.elementTextContains(
          driver.findElement(By.xpath("//span")),
          "Last Name"
        )
      )
      .then(driver.findElement(By.xpath("//span[text()='Last Name']")).click());

    await driver
      .findElements(By.xpath("//table[@id='table1']/tbody/tr/td[1]"))
      .then(elements => {
        let promiseArray = [];

        elements.forEach(el => {
          promiseArray.push(el.getText());
        });

        return Promise.all(promiseArray).then(result => result);
      })
      .then(result => expect(result).to.be.sorted());
  });

  it("contains appropriate characters for 'first name' column", async () => {
    await driver
      .findElements(By.xpath("//table[@id='table1']/tbody/tr/td[2]"))
      .then(elements => {
        let promiseArray = [];

        elements.forEach(el => {
          promiseArray.push(el.getText());
        });

        return Promise.all(promiseArray).then(result => result);
      })
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^[a-zA-Z]+$/);
        });
      });
  });

  it("contains appropriate characters for 'email' column", async () => {
    await driver
      .findElements(By.xpath("//table[@id='table1']/tbody/tr/td[3]"))
      .then(elements => {
        let promiseArray = [];

        elements.forEach(el => {
          promiseArray.push(el.getText());
        });

        return Promise.all(promiseArray).then(result => result);
      })
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+(.com|.net)$/);
        });
      });
  });

  it("contains appropriate characters for 'due' column", async () => {
    await driver
      .findElements(By.xpath("//table[@id='table1']/tbody/tr/td[4]"))
      .then(elements => {
        let promiseArray = [];

        elements.forEach(el => {
          promiseArray.push(el.getText());
        });

        return Promise.all(promiseArray).then(result => result);
      })
      .then(result => {
        result.forEach(text => {
          expect(text).to.match(/^\$[0-9]+\.[0-9][0-9]$/);
        });
      });
  });

  it("contains appropriate characters for 'web site' column", async () => {
    await driver
      .findElements(By.xpath("//table[@id='table1']/tbody/tr/td[5]"))
      .then(elements => {
        let promiseArray = [];

        elements.forEach(el => {
          promiseArray.push(el.getText());
        });

        return Promise.all(promiseArray).then(result => result);
      })
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

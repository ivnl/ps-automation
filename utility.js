require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");

if (!process.argv[2]) {
  console.log(
    "\nPlease run the script supplying exactly one integer argument IE: 'node utility.js 3'"
  );
  return;
}

let scrollInput = parseInt(process.argv[2]);

/**
 * Test infinite scroll using webdriver, variable number of page scrolls.
 * @param {number} scrollInput The desired number of scrolls to attempt, given at CLI run time
 * @returns {Object} driver, for clean up/exit purposes when all such tests are completed
 */
const infiniteScroll = async function infiniteScroll(scrollInput) {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://the-internet.herokuapp.com/infinite_scroll");
    await driver.wait(() => {
      return driver
        .findElements(By.className("jscroll-loading"))
        .then(function(el) {
          return el.length === 0;
        });
    });

    let scrollCount = 0;

    while (scrollCount !== scrollInput) {
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight)"
      );

      //TODO: refactor repeated code here, used for waiting for an element to dissapear
      await driver.wait(() => {
        return driver
          .findElements(By.className("jscroll-loading"))
          .then(function(el) {
            if (el.length === 0) {
              scrollCount++;
            }
            return el.length === 0;
          });
      });
    }
  } catch (e) {
    console.log(e);
  } finally {
    return driver;
  }
};

/**
 * checkBox helper function for clicking and randomization
 * @param {Object} box, the input webelement that is passed in for clicking
 */
const clicker = function clicker(box) {
  const randomNumber = Math.floor(Math.random() * 10) + 1;

  for (let i = 0; i < randomNumber; i++) {
    box.click();
  }
};

/**
 * Test checkBox selection, checks each box a random amount of times between 1-10.
 * @returns {Object} driver, for clean up/exit purposes when all such tests are completed
 */
const checkBoxes = async function checkBoxes() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://the-internet.herokuapp.com/checkboxes");
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("checkboxes")))
    );

    const checkBoxOne = await driver.findElement(
      By.xpath("//*[@id='checkboxes']/input[1]")
    );

    const checkBoxTwo = await driver.findElement(
      By.xpath("//*[@id='checkboxes']/input[2]")
    );

    clicker(checkBoxOne);
    clicker(checkBoxTwo);
  } catch (e) {
    console.log(e);
  } finally {
    return driver;
  }
};

/**
 * Test dropdown selection, selects a random available option.
 * @returns {Object} driver, for clean up/exit purposes when all such tests are completed
 */
const dropDown = async function dropDown() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://the-internet.herokuapp.com/dropdown");
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("dropdown")))
    );

    let options = await driver
      .findElements(
        By.xpath("//*[@id='dropdown']/option[not(@disabled='disabled')]")
      )
      .then(elements => {
        return elements;
      });

    await options[Math.floor(Math.random() * options.length)].click();
  } catch (e) {
    console.log(e);
  } finally {
    return driver;
  }
};

Promise.all([infiniteScroll(scrollInput), checkBoxes(), dropDown()]).then(
  drivers =>
    drivers.forEach(driver => {
      driver.quit();
    })
);

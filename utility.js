require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");

const pageModel = require("./pageModel.js");

if (!process.argv[2]) {
  console.log(
    "\nPlease run the script supplying exactly one integer argument IE: 'node utility.js 3'"
  );
  return;
}

const scrollInput = parseInt(process.argv[2]);

/**
 * Test infinite scroll using webdriver, variable number of page scrolls.
 * @param {number} scrollInput The desired number of scrolls to attempt, given at CLI run time
 */
const infiniteScroll = async function infiniteScroll(scrollInput) {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://the-internet.herokuapp.com/infinite_scroll");
    await pageModel.waitForInfiniteScroll(driver);

    let scrollCount = 0;

    while (scrollCount !== scrollInput) {
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight)"
      );

      await pageModel.waitForInfiniteScroll(driver).then(result => {
        if (result) scrollCount++;
      });
    }
  } catch (e) {
    console.log(e);
  } finally {
    await driver.close().then(console.log("infinite scroll test complete"));
  }
};

/**
 * checkBox helper function for clicking and randomization
 * @param {Object} box, the input webelement that is passed in for clicking
 */
const boxClicker = async function boxClicker(box) {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < randomNumber; i++) {
    await box.click();
  }
};

/**
 * Test checkBox selection, checks each box a random amount of times between 1-10.
 */
const checkBoxes = async function checkBoxes() {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://the-internet.herokuapp.com/checkboxes");
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("checkboxes")))
    );

    // todo: extract elements to pom?
    const checkBoxOne = await driver.findElement(
      By.xpath("//*[@id='checkboxes']/input[1]")
    );

    const checkBoxTwo = await driver.findElement(
      By.xpath("//*[@id='checkboxes']/input[2]")
    );

    await boxClicker(checkBoxOne);
    await boxClicker(checkBoxTwo);
  } catch (e) {
    console.log(e);
  } finally {
    await driver.close().then(console.log("checkbox test complete"));
  }
};

/**
 * Test dropdown selection, selects a random available option.
 */
const dropDown = async function dropDown() {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://the-internet.herokuapp.com/dropdown");
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("dropdown")))
    );

    // todo: extract elements to pom?
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
    await driver.close().then(console.log("dropdown test complete"));
  }
};

// todo: create better test run, maybe interactivity at CLI level
infiniteScroll(scrollInput);
checkBoxes();
dropDown();

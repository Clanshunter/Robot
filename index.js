const puppeteer = require('puppeteer');
const notifier = require('node-notifier');

var delay = 20000;

var countAntrag = 0;

var text='Aktuell sind leider keine freien Termine verfügbar. Bitte versuchen Sie es in den nächsten Tagen erneut.';

setInterval(() => {testAntrag();countAntrag++;}, delay);

async function testAntrag() {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 })
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
// Go To Website
    await page.goto('https://termine.moenchengladbach.de/')
    await page.setViewport({ width: 1366, height: 768 })
// Close the Cookie
    await page.waitForSelector('#cookie_msg_btn_no')
    await page.click('#cookie_msg_btn_no')
// Select Einbuergerung
    await page.waitForSelector('#inhalt > .button_container > ul > li > #buttonfunktionseinheit-14')
    await page.click('#inhalt > .button_container > ul > li > #buttonfunktionseinheit-14')
    await navigationPromise
// Select 1 and Click next
    await page.waitForSelector('#rowContainer-84 > #inputBox-84 > .input-group-btn > #button-plus-84 > .glyphicon')
    await page.click('#rowContainer-84 > #inputBox-84 > .input-group-btn > #button-plus-84 > .glyphicon')

    await page.waitForSelector('.container > .content > .button_container > #cnc-select-form > .pull-right')
    await page.click('.container > .content > .button_container > #cnc-select-form > .pull-right')
//Select Ok 
    await page.waitForSelector('#TevisDialog > .modal-dialog > .modal-content > .modal-footer > #OKButton')
    await page.click('#TevisDialog > .modal-dialog > .modal-content > .modal-footer > #OKButton')
    await navigationPromise
// Get the Text area
    await page.waitForSelector('.TEVISWEB > .container > #inhalt > .row > p:nth-child(1)')
    await page.click('.TEVISWEB > .container > #inhalt > .row > p:nth-child(1)')
    var result = await page.$eval(".TEVISWEB > .container > #inhalt > .row > p:nth-child(1)", el => el.innerText);
//check the Availibility and Make screenshot and Notification
    if (result == text) {
      await navigationPromise
      await page.screenshot({ path: 'pic/antrag/kein/' + countAntrag + 'KeinFrei.jpg', fullPage: true });
      await browser.close();
    } else {

      notifier.notify(
        {
          title: 'Termin Available',
          message: 'Hello from node, Mr. User!',
          sound: true, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        },)
      await page.screenshot({ path: 'pic/antrag/frei/' + countAntrag + 'Termin.jpg', fullPage: true });
    }
    
  } catch (error) {
    console.log(error);
  }

}
 

 
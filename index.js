const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const url = 'https://www.tokopedia.com/sukandahome';

const options = new chrome.Options();
options.addArguments('--ignore-certificate-errors');
options.addArguments('--window-size=1920,1080');
options.addArguments('--start-maximized');

const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
        {id: 'image', title: 'Image'},
        {id: 'product', title: 'Name'},
        {id: 'price', title: 'Price'},
        {id: 'discount', title: 'Discount'},
        {id: 'priceReal', title: 'Price Real'},
        {id: 'rating', title: 'Rating'},
        {id: 'sold', title: 'Sold'},
    ]
});


(async function scraping() {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    await driver.get(url);

    await delay(3000);
    await driver.executeScript('window.scrollBy(0,3000)');
    await delay(3000);
    for (let i = 0; i < 5; i++) {
        await driver.executeScript('window.scrollBy(0,1000)');
        await delay(3000);
    }

    let container = await driver.findElement(By.xpath('//*[@id="zeus-root"]/div/div[2]/div[2]/div[4]/div[2]/div/div[1]'));
    let containerPrd = await container.findElements(By.className('prd_container-card'));

    let data = [];
    let image;
    let product;
    let price;
    let discount;
    let priceReal;
    let rating;
    let sold;

    for (const containerPrdElement of containerPrd) {
        try {
            image = await containerPrdElement.findElement(By.className('css-1c345mg')).getAttribute('src');
        } catch (e) {
            image = '';
        }

        try {
            product = await containerPrdElement.findElement(By.className('prd_link-product-name')).getText();
        } catch (e) {
            product = '';
        }

        try {
            price = await containerPrdElement.findElement(By.className('prd_link-product-price')).getText();
        } catch (e) {
            price = '';
        }

        try {
            discount = await containerPrdElement.findElement(By.className('prd_badge-product-discount')).getText();
        } catch (e) {
            discount = '';
        }

        try {
            priceReal = await containerPrdElement.findElement(By.className('prd_label-product-slash-price')).getText();
        } catch (e) {
            priceReal = price;
        }

        try {
            rating = await containerPrdElement.findElement(By.className('prd_rating-average-text')).getText();
        } catch (e) {
            rating = '';
        }

        try {
            sold = await containerPrdElement.findElement(By.className('prd_label-integrity')).getText();
        } catch (e) {
            sold = '';
        }

        data.push({
            image: image,
            product: product,
            price: price,
            discount: discount,
            priceReal: priceReal,
            rating: rating,
            sold: sold,
        })
    }

    await driver.quit();

    csvWriter
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
})();

// set delay
const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

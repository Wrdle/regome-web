import * as puppeteer from 'puppeteer';

export default class RegoScraper {
    private reData = /<dl class="data">(.*)<\/dl>/gs
	private reRegoNumber = /<dt>Registration number<\/dt><dd>(.+?)<\/dd>/g
	private reVIN = /<dt>Vehicle Identification Number \(VIN\)<\/dt><dd>(.+?)<\/dd>/g
	private reDescription = /<dt>Description<\/dt><dd>(.+?)<\/dd>/g
	private rePurpose = /<dt>Purpose of use<\/dt><dd>(.+?)<\/dd>/g
	private reStatus = /<dt>Status<\/dt><dd>(.+?)<\/dd>/g
	private reExpiry = /<dt>Expiry<\/dt><dd>(.+?)<\/dd>/g
    
    private browser;
    private page;

    private searchURL: string = 'https://www.service.transport.qld.gov.au/checkrego/application/VehicleSearch.xhtml';

    public static async build(): Promise<RegoScraper> {
        var scraper = new RegoScraper();

        scraper.browser = await puppeteer.launch();
        scraper.page = await scraper.browser.newPage();

        await scraper.page.goto(scraper.searchURL);

        await scraper.page.click('[name="tAndCForm:confirmButton"]');
        await scraper.page.waitForNavigation()

        return scraper;
    }

    public async ByRegoNumber(input) {
        var content: string;

        var searchPageUrl = await this.page.url()

        // Set rego number field to user input
        await this.page.$eval('[name="vehicleSearchForm:plateNumber"]', (el, value) => el.value = value, input);

        await this.page.click('[name="vehicleSearchForm:confirmButton"]');
        await this.page.waitForNavigation()

        content = await this.page.content();

        // Check for bad rego
        if (this.page.url() == searchPageUrl && content.match(/ui-state-error/g).length > 0) {
            throw new Error("Bad plates");
        }

        return this.getData(content);
    }

    public async ByVIN(input) {
        var content: string;

        var searchPageUrl = await this.page.url()

        // Set VIN field to user input
        await this.page.$eval('[name="vehicleSearchForm:referenceId"]', (el, value) => el.value = value, input);

        await this.page.click('[name="vehicleSearchForm:confirmButton"]');
        await this.page.waitForNavigation()

        content = await this.page.content();

        // Check for bad VIN
        if (this.page.url() == searchPageUrl && content.match(/ui-state-error/g).length > 0) {
            throw new Error("Bad VIN");
        }

        return this.getData(content);
    }

    private getData(content): CarData {
        try{
            var data = content.match(this.reData)[0];
      
            data = data.replace(/[\t\n\r]/gm,'');
    
            var regoNumber = this.reRegoNumber.exec(data)[1];
            var vin = this.reVIN.exec(data)[1];
            var description = this.reDescription.exec(data)[1];
            var purpose = this.rePurpose.exec(data)[1];
            var status = this.reStatus.exec(data)[1];
            var expiry = this.reExpiry.exec(data)[1];

            return new CarData(regoNumber, vin, description, purpose, status, expiry);
          }
          catch(err) {
              console.log(err);
              throw new Error("Unable to process data");
          }
    }

    public async Close() {
        await this.browser.close();
    }
}

class CarData {
    public RegistrationNumber: string;
    public VIN: string;
    public Description: string;
    public Purpose: string;
    public Status: string;
    public Expiry: string;

    constructor(registrationNumber: string, vin: string, description: string, purpose: string, status: string, expiry: string) {
        this.RegistrationNumber = registrationNumber;
        this.VIN = vin;
        this.Description = description;
        this.Purpose = purpose;
        this.Status = status;
        this.Expiry = expiry;
    }
}
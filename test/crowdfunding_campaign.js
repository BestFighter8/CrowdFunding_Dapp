const CrowdfundingCampaign = artifacts.require('CrowdfundingCampaign');

  contract('CrowdfundingCampaign', accounts => {
    let instance;

    beforeEach(async () => {
      instance = await CrowdfundingCampaign.new({ from: accounts[0] });
    });

    // This test will create 2 new campaigns, with the same data (only deadline may vary, cause of asynchronous execution 
    // (3 secs between each execution, i believe this amount comes from my Ganache block generation time)
    // Then I check if stored data is actually the same as assigned before and if the deadline is slightly bigger then creation time + duration.
    // for getting time I use getCurrentTime() function from my contract, that returns current block.timestamp
    //
    // Assign values of Campaign
    const duration = 100;
    const raisingGoal = 10000;
    const title = 'Test Campaign';
    const description = 'This is a test campaign';
    const image = 'image.jpg';

    it('should create a campaign struct with the correct values', async () => { 

      let time = await instance.getCurrentTime(); // Get time from blockchain, represented in seconds
      await instance.createCampaign(duration, raisingGoal, title, description, image, { from: accounts[0]}); // Create first campaign
      await instance.createCampaign(duration, raisingGoal, title, description, image, { from: accounts[0]}); // Create second campaign
      const campaign1 = await instance.campaigns(1);
      const campaign2 = await instance.campaigns(2);

      // Check if all values are stored correctly. 
        // Check if owner is the same, as intended
      assert.equal(campaign2.owner, campaign1.owner);
        // Check IDs of both campaigns are correct
      assert.equal(campaign1.campaignID, 1);
      assert.equal(campaign2.campaignID, 2);
        // Check if info was assigned correctly to any of two campaigns (I chose camp2)
      assert.equal(campaign2.title, title);
      assert.equal(campaign2.description, description);
      assert.equal(campaign2.image, image);
      assert.equal(campaign2.duration, duration);
      assert.equal(campaign2.raisingGoal, raisingGoal);
        // Check if amountCollected is set on 0 and isn't undefined
      assert.equal(campaign2.amountCollected.toNumber(), 0);
        // Check if deadline is greater than creation time + duration (they should be around 3 seconds apart cuz of await)
      assert.isAtLeast(campaign2.deadline.toNumber(), +time + +duration, 'deadline is smaller than creation time + duration');
      console.log(campaign1); // Show all the info in console to check it visually
      console.log(campaign2); // for both campaigns
    }); // I also added the LogCampaign event to the contract, so we can always see if the data was passed correctly, even if the test fails.
 

    // This test will create a new campaign, check if it exists and is not donated to, donate to it and check if amount is updated
    it("should add ETH to a specific campaign", async () => {
      // Create a campaign
      await instance.createCampaign(100, 10000, 'Name', 'Description', 'image.jpg', { from: accounts[0]});
      // Get the campaign
      const campaign = await instance.campaigns(1);
      // Make sure the campaign exists
      assert.equal(campaign.campaignID, 1);
      assert.equal(campaign.amountCollected.toNumber(), 0);
      // Donate to the campaign
      await instance.donateToCampaign(1, { from: accounts[1], value: 5000 });
      // Get the campaign again
      const updatedCampaign = await instance.campaigns(1);
      // Check if the amount collected was updated
      assert.equal(updatedCampaign.amountCollected.toNumber(), 5000);
      // Show the log
      console.log(updatedCampaign);
    });


    // This test will create a new campaign, donate to it and then call the withdrawFunds()function with the campaign ID. 
    // Finally, it will check if the funds have been withdrawn by checking the amount collected = 0 again.
    it('should withdraw funds properly', async () => {
      // Create a campaign
      await instance.createCampaign(100, 10000, 'Name', 'Description', 'image.jpg', {from: accounts[0]});
      // Get the campaign
      const campaign = await instance.campaigns(1);
      // Make sure the campaign exists
      assert.equal(campaign.campaignID, 1);      
      // Donate to the campaign
      await instance.donateToCampaign(1, { from: accounts[1], value: 10000 });
      // Get the updated campaign
      const updatedCampaign = await instance.campaigns(1);
      // Check if the amount collected was updated
      assert.equal(updatedCampaign.amountCollected.toNumber(), 10000);
      // Withdraw funds from the campaign
      const sent = await instance.withdrawFunds(1, {from: accounts[0]});
      console.log(sent);
      // Check if funds have been withdrawn
      const campaignInfo = await instance.campaigns(1);
      assert.equal(campaignInfo.amountCollected.toNumber(), 0);
    });


    it("should refund the caller's contribution", async () => {

      // Create a campaign
      await instance.createCampaign(100, 10000, 'Name', 'Description', 'image.jpg', {from: accounts[0]});
      // Get the campaign
      const campaign = await instance.campaigns(1);
      // Make sure the campaign exists
      assert.equal(campaign.campaignID, 1);      
      // Donate to the campaign
      await instance.donateToCampaign(1, { from: accounts[1], value: 4000 });
      await instance.donateToCampaign(1, { from: accounts[2], value: 3000 });
      // Get the updated campaign
      const updatedCampaign = await instance.campaigns(1);
      // Check if the amount collected was updated
      assert.equal(updatedCampaign.amountCollected.toNumber(), 7000);
      // check if the transfer was successful, return 'sent' on success
      const sent = await instance.refund(1, {from: accounts[1]});
      console.log(sent);
      // Check if amountCollected was chaged
      const campaignInfo = await instance.campaigns(1);
      assert.equal(campaignInfo.amountCollected.toNumber(), 3000);
    });

});

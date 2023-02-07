const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(CrowdfundingCampaign)
};
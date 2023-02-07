# CrowdFunding_Dapp

CrowdfundingDapp Contract Documentation

This contract implements a crowdfunding campaign with the following features:

Create a new campaign with a duration, raising goal, title, description, and image.

Donate ETH to an existing campaign.

Withdraw funds from a successful campaign.

Get a list of donators and donations for a campaign.

Get a list of all campaigns.


Structs
The contract stores campaign data in the Campaign struct.

struct Campaign {
    uint campaignID;
    address payable owner;
    string title;
    string description;
    string image;
    uint duration;
    uint raisingGoal;
    uint deadline;
    uint amountCollected;
    address[] donators;
    uint256[] donations;
}

Mappings
The contract stores campaigns in a mapping from campaign ID to Campaign struct:

mapping(uint => Campaign) public campaigns;

Functions
createCampaign

createCampaign is used to create a new crowdfunding campaign.

  Parameters
  _duration: Duration of the campaign in seconds.
  _raisingGoal: Amount of ETH that must be raised for the campaign to be successful.
  _title: Title of the campaign.
  _description: Description of the campaign.
  _image: Image associated with the campaign.
  Returns campaign ID of the newly created campaign.

donateToCampaign
donateToCampaign
 is used to donate ETH to an existing campaign.

Parameters
_campaignID
: ID of the campaign to donate to.
withdrawFunds
withdrawFunds
 is used to withdraw funds from a successful campaign. Only the campaign creator can withdraw funds.

Parameters
_campaignID
: ID of the campaign to withdraw funds from.
getDonators
getDonators
 is used to get a list of donators and donations for a campaign.

Parameters
_campaignID
: ID of the campaign to get donators and donations for.
Returns
Returns an array of donator addresses and an array of donation amounts associated with the campaign.

getCampaigns
getCampaigns
 is used to get a list of all campaigns.

Returns
Returns an array of 
Campaign
 structs containing all campaigns.

getCurrentTime
getCurrentTime
 is used to get the current time. This is used for testing only.

Returns
Returns the current time in seconds since the Unix epoch.

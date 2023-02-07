CrowdfundingCampaign Contract Documentation
This contract allows users to create and donate to crowdfunding campaigns. It also allows campaign owners to withdraw funds if the goal is met.

Constructor
The constructor sets the deployer to the address of the contract creator.

Structs
    The contract has a single struct, Campaign, which holds data about an individual campaign. It contains the following fields:
    campaignID
    : a unique identifier for the campaign
    owner
    : the address of the campaign creator
    title
    : the title of the campaign
    description
    : a description of the campaign
    image
    : an image associated with the campaign
    duration
    : the length of the campaign in seconds
    raisingGoal
    : the amount of ETH needed to reach the goal of the campaign
    deadline
    : the timestamp when the campaign ends
    amountCollected
    : the amount of ETH currently collected for the campaign
    donators
    : a mapping of addresses to the amount of ETH donated by each address

Events
    The contract emits a LogCampaign event when a new campaign is created. It shows all the fields from struct, but nested mapping of donators:
    campaignID
    owner
    title
    description
    image
    duration
    raisingGoal
    deadline
    amountCollected

Functions
The contract has the following functions:

    createCampaign()
        This function allows users to create a new crowdfunding campaign. It takes the following parameters:
        _duration
        _raisingGoal
        _title
        _description
        _image
        It returns the number of campaigns created.

    donateToCampaign
        This function allows users to donate to an existing crowdfunding campaign. It takes the following parameter:
        _campaignID
        It requires that the campaign exists, that the campaign's deadline has not passed, and that the transaction has a value. It adds the value of the transaction to the campaign's amountCollected and stores the amount donated by the sender in the donators mapping.

    refund()
        This function allows users to withdraw their donation from a crowdfunding campaign. It also takes the parameter _campaignID
        It requires that the campaign exists, that the campaign has failed to meet its goal, that the sender has donated to the campaign. It refunds the amount donated by the sender to their address and decreases the campaign's amountCollected accordingly. If the campaign has no remaining funds and its deadline has passed, it is deleted from the contract. 
        Optionally we can also enable requirement , that the campaign's deadline has passed. This way refunds will only be possible on finished, failed campaigns.

    withdrawFunds
        This function allows campaign owners to withdraw funds from a successful crowdfunding campaign. It also takes the parameter _campaignID 
        It requires that the campaign exists, that the campaign has met its goal, and that the sender is the campaign owner. It transfers the amount raised to the campaign owner minus a 5% commission. The commission is automatically transferred to the contract deployer. It then deletes the campaign from the contract.

    getAllCampaigns
        This function returns an array of CampaignView structs containing data about all existing campaigns. It does not include data about the donators, because it’s contained in the nested mapping and these mappings are not iterable.

    getCurrentTime
        This function returns the current timestamp. It is used mostly for testing purposes, but can be used in JavaScript, so time on website will be syncronised with block.timestamp, which may vary from scripts Date.now().

Contract is written on Solidity version 0.8.17. Tests are realised using Truffle and Ganache testing environment. Live version is deployed to Goerli Etherium Testnet (https://rpc.ankr.com/eth_goerli). Test also contains tests results (terminal log). Contract was also tested manually using https://remix.ethereum.org/.

pragma solidity ^0.4.17;

contract DonationFactory {
    address[] public deployedDonations;

    function createDonation(address vender, uint value, string prod) public {
        require(vender != msg.sender);
        address newDonation = new Donation(msg.sender, vender, value, prod);
        deployedDonations.push(newDonation);
    }

    function getDeployedDonations() public view returns (address[]){
        return deployedDonations;
    }
}

contract Donation {

    struct Request {
        address recipient;
        uint targetAmount;
        string product;
    }

    address public requester;
    uint public donatorsCount;
    uint public remaining;
    string public status;
    Request[] public requests;
    mapping(address => uint) donators;

    function Donation( address sender, address vender, uint value, string prod ) public {
        requester = sender;
        Request memory newRequest = Request({ recipient: vender, targetAmount: value, product: prod });
        requests.push(newRequest);
        status = "pending";
        remaining = value;
    }

    function donate(uint idx) public payable {
        require(msg.value > 0);
        require(this.balance <= requests[idx].targetAmount);

        if(requests[idx].targetAmount == this.balance){
            status = "ready";
        }

        if(donators[msg.sender] == 0){
            donators[msg.sender] = msg.value;

            donatorsCount++;
        } else {
            donators[msg.sender] += msg.value;

        }
        remaining -= msg.value;
    }

    function complete(uint idx) public {
        require(msg.sender == requester );
        require(this.balance == requests[idx].targetAmount);
        status = "completed";
        requests[idx].recipient.transfer(this.balance);
    }

    function getContribution(address person) public view returns (uint) {
        return donators[person];
    }

}

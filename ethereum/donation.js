import web3 from './web3'
import Donation from './build/Donation.json'

export default address => {
  return new web3.eth.Contract(JSON.parse(Donation.interface), address)
}

import web3 from '../../ethereum/web3'

const initialState = {}

const ALL_DONATIONS = 'ALL_DONATIONS'
const SINGLE_DONATION = 'SINGLE_DONATION'

const NEW_DONATION = 'NEW_DONATION'
const DONATE = 'DONATE'
const COMPLETE = 'COMPLETE'
const GET_CONTRIBUTION = 'GET_CONTRIBUTION'

const allDonation = contracts => ({type: ALL_DONATIONS, contracts})
const singleDonation = contract => ({type: SINGLE_DONATION, contract})
const newDonation = contract => ({type: NEW_DONATION, contract})
const donate = info => ({type: DONATE, info})
const complete = info => ({type: COMPLETE, info})
const get_contribution = info => ({type: GET_CONTRIBUTION, info})

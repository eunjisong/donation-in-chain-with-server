import Web3 from 'web3'
let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // 브라우저에 접근 && 메타마스크가 설치 되어 있을때
  // 메타마스크가 제공하는 프로바이더를 삽입
  web3 = new Web3(window.web3.currentProvider)
} else {
  // 서버에 접근 || 메타마스크가 설치 안되어 있을때
  // 렌더링만큼은 인퓨라가 제공하는 프로바이더를 사용하여 유저에게 방해되지 말게 하라
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/b511522af4e14268b390f2ce3745d0cb'
  )
  web3 = new Web3(provider)
}

export default web3

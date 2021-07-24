import { ethers } from 'ethers';
// import Web3 from 'web3';
import communityAbi from './communityContractAbi.json';
import { pushJSONDocument } from '../utils/textile.hub';

export const getCommunity = async () => {
  const res = await fetch('https://api.distributed.town/api/community/0xB433eE0b9F10575218D9ba7A2FA5993cd08cb953', {
    method: 'GET'
  })   
    const comm = await res.json();
    return comm;
}
// const ethEnabled = async () => {
//   if (window.ethereum) {
//     await window.ethereum.send('eth_requestAccounts');
//     (window as any).web3 = new Web3(window.ethereum);
//     return true;
//   }
//   return false;
// }
export const joinCommunity = async () => {
  try {
    // await ethEnabled();
    console.log(await window.ethereum);
    const provider = new ethers.providers.Web3Provider((window as any).web3.currentProvider);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      '0x816cCA942547e5741e4c7409D4fa8B62AD9a61e4',
      communityAbi,
      signer,
    );

    const metadataJson = {
      name: `Mike's SkillWallet`,
      description: "Universal, self-sovereign IDs tied to skills & contributions rather than personal data.",
      image: 'https://hub.textile.io/ipfs/bafkreiaks3kjggtxqaj3ixk6ce2difaxj5r6lbemx5kcqdkdtub5vwv5mi',
      properties: {
        username: 'Mike',
        skills: [
          {
            name: "Creator",
            value:10
          }]
      }
    }

    const url = await pushJSONDocument(metadataJson)
    const createTx = await contract.joinNewMember(
      0,
      0,
      0,
      0,
      0,
      0,
      url,
      2006,
    );

    console.log(createTx);
  } catch (err) {
    console.log(err);
    return;
  }
}

export const getSkillWalletNonce = async () => {
  const response = await fetch('https://api.skillwallet.id/api/skillwallet/-1/nonces?action=1', {
      method: 'POST'
  })
  const nonce = await response.json();
  return nonce.nonce;
};

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

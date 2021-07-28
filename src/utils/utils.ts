import { ethers } from 'ethers';
// import Web3 from 'web3';
import communityAbi from './communityContractAbi.json';
import { pushJSONDocument } from '../utils/textile.hub';

export const getCommunity = async (partnerKey) => {
  const res = await fetch(`https://api.distributed.town/api/community/key/${partnerKey}`, {
    method: 'GET'
  })
  const comm = await res.json();
  return comm;
}

export const joinCommunity = async (communityAddress, username, skill, level) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      communityAddress,
      communityAbi,
      signer,
    );

    const metadataJson = {
      name: `${username}'s SkillWallet`,
      description: "Universal, self-sovereign IDs tied to skills & contributions rather than personal data.",
      image: localStorage.getItem('imageUrl'),
      properties: {
        username,
        skills: [
          {
            name: skill,
            value: level
          }]
      }
    }
    console.log(metadataJson);

    const url = await pushJSONDocument(metadataJson)
    console.log(url);
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

    const communityTransactionResult = await createTx.wait();
    console.log(communityTransactionResult);
    const { events } = communityTransactionResult;
    const memberJoinedEvent = events.find(
      e => e.event === 'MemberAdded',
    );
    
    if(memberJoinedEvent) {
      // return tokenID.
      return memberJoinedEvent.args[1].toString();
    } else {
      throw new Error('Something went wrong');
    }
  } catch (err) {
    console.log(err);
    return;
  }
}

export const getSkillWalletNonce = async (tokenId) => {
  const action = tokenId > -1 ? 0 : 1
  const response = await fetch(`https://api.skillwallet.id/api/skillwallet/${tokenId}/nonces?action=${action}`, {
    method: 'POST'
  })
  const nonce = await response.json();
  return nonce.nonce;
};

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

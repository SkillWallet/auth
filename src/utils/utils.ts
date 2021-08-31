import { ethers } from 'ethers';
// import Web3 from 'web3';
import communityAbi from './communityContractAbi.json';
import { pushJSONDocument } from '../utils/textile.hub';
import skillWalletAbi from './skillWalletAbi.json';

export const getCommunity = async (partnerKey) => {
  const res = await fetch(`https://api.distributed.town/api/community/key/${partnerKey}`, {
    method: 'GET'
  })
  const comm = await res.json();
  return comm;
}

// TODO: do we need to handle a Partner calling this from roles-screen-partner (with 'null' for a skill)?
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

    if (memberJoinedEvent) {
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

export const getActivationNonce = async (tokenId) => {
  const response = await fetch(`https://api.skillwallet.id/api/skillwallet/${tokenId}/nonces?action=0`, {
    method: 'POST'
  })
  const nonce = await response.json();
  return nonce.nonce;
};

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const fetchSkillWallet = async (address: string) => {
  console.log('fetching...');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const skillWalletAddress = '0x24463BE842CC94199f336B5D1BaEb4Bcb546a18C';
  const contract = new ethers.Contract(
    skillWalletAddress,
    skillWalletAbi,
    signer,
  );
  console.log(address);

  console.log(contract);

  const skillWalletId = await contract.getSkillWalletIdByOwner(address);
  console.log(skillWalletId);

  const isActive = await contract.isSkillWalletActivated(skillWalletId);
  if (!isActive) {
    alert('You should first activate your skillWallet by scanning the QR code!');
  } else {
    const res = await fetch(`https://api.skillwallet.id/api/skillwallet?tokenId=${skillWalletId}`, {
      method: 'GET'
    })
    const skillWallet = await res.json();
    if (skillWallet && skillWallet.nickname) {
      console.log('setting local storage with SW');
      localStorage.setItem('skillWallet', JSON.stringify(skillWallet));
    }
  }
}

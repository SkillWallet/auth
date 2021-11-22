import { ethers } from 'ethers';
import { pushJSONDocument } from '../utils/textile.hub';
import skillWalletAbi from './skillWalletAbi.json';
import communityAbi from './communityAbi.json';
import partnersAbi from './partnersAgreementAbi.json';

const sw = document.querySelector("skillwallet-auth")
const event = new CustomEvent("onSkillwalletError"
  // , {
  //     'detail': {
  //         communityAddr: partnersDetails.communityAddr,
  //         partnersAddr: partnersDetails.partnersAddr
  //     }
  // }
)

export const getCommunity = async (partnerKey) => {
  const res = await fetch(`https://api.distributed.town/api/community/key/${partnerKey}`, {
    method: 'GET'
  })
  const comm = await res.json();
  return comm;
}


export const getSkillwalletAddress = async () => {
  const res = await fetch('https://api.skillwallet.id/api/skillwallet/config', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  });
  const swAddress = await res.json();
  return swAddress;
}

export const joinCommunity = async (provider, communityAddress, username, skill, level) => {
  try {
    console.log('trying to join community', communityAddress);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      communityAddress,
      JSON.stringify(communityAbi),
      signer,
    );

    const metadataJson = {
      name: `${username}'s SkillWallet`,
      description: "Universal, self-sovereign IDs tied to skills & contributions rather than personal data.",
      image: window.sessionStorage.getItem('imageUrl'),
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
    sw.dispatchEvent(event);
    const error = err.data.message;

    if (error.includes("No free spots left")) {
      alert("There are no available spots in this community.")
    } else if (error.includes("Already a member")) {
      alert("You are already a member of this community.")
    } else if (error.includes("SkillWallet already registered")) {
      alert("You already registered a SkillWallet for this wallet address.")
    } else {
      alert("An error occured - please try again.")
    }
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

export const fetchSkillWallet = async (provider: any, address: string) => {
  try {

  console.log('fetching...');

  const skillWalletAddress = await getSkillwalletAddress();
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    skillWalletAddress.skillWalletAddress,
    skillWalletAbi,
    signer,
  );

  const tokenId = await contract.getSkillWalletIdByOwner(address);
  console.log(tokenId);

  const isActive = contract.isSkillWalletActivated(tokenId);
  if (isActive) {
    const jsonUri = await contract.tokenURI(tokenId);
    const community = await contract.getActiveCommunity(tokenId);
    let res = await fetch(jsonUri);
    const jsonMetadata = await res.json()
    let skillWallet: any = {
      imageUrl: jsonMetadata.image,
      nickname: jsonMetadata.properties.username,
      skills: jsonMetadata.properties.skills,
      community: community,
      diToCredits: 2060,
      tokenId: tokenId.toString()
    };

    if (skillWallet && skillWallet.nickname) {
      console.log('setting local storage with SW');
      window.sessionStorage.setItem('skillWallet', JSON.stringify(skillWallet));
    } else if (!skillWallet) {
      alert('Unable to find a Skill Wallet and nickname with your ID')
    }
  }
  } catch (error) {
    sw.dispatchEvent(event);
    if (error.data && error.data.message.includes("invalid")) {
      alert("The SkillWallet owner is invalid.");
      console.log(error);
    } else {
      alert("An error occured - please try again.");
      console.log(error);
    }
    return;
  }
}

export const changeNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }],
    });
  } catch (switchError) {
    sw.dispatchEvent(event);
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13881', // A 0x-prefixed hexadecimal string
            chainName: 'Mumbai',
            nativeCurrency: {
              name: 'Matic',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.matic.today'],
            blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/']
          }]
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}

export const activatePA = async (partnersAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      partnersAddress,
      JSON.stringify(partnersAbi),
      signer,
    );
    console.log('cntrct: ', contract);

    const createTx = await contract.activatePA();

    const res = await createTx.wait();
    console.log('res: ', res);
    // const { events } = communityTransactionResult;
    // const memberJoinedEvent = events.find(
    //   e => e.event === 'MemberAdded',
    // );

    //   if (memberJoinedEvent) {
    //     // return tokenID.
    //     return memberJoinedEvent.args[1].toString();
    //   } else {
    //     throw new Error('Something went wrong');
    //   }
    // } 
    return true;
  }
  catch (err) {
    sw.dispatchEvent(event);
    console.log(err);
    return;
  }
}
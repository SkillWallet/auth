import { ethers } from 'ethers';
import { pushJSONDocument, pushImage } from '../utils/textile.hub';
import skillWalletAbi from './skillWalletAbi.json';
import communityAbi from './communityAbi.json';
import partnersAbi from './partnersAgreementAbi.json';
// import partnersRegistryAbi from './partnersRegistryAbi.json';
import partnersAgreementAbi from './partnersAgreementAbi.json';
import membershipAbi from './membershipAbi.json';

let partnersAgreementAddress = '';
let membershipAddress = '';

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
  await changeNetwork();
  const res = await fetch(`https://api.distributed.town/api/community/key/${partnerKey}`, {
    method: 'GET'
  })
  const comm = await res.json();
  partnersAgreementAddress = comm.partnersAgreementAddress;
  console.log('partnersA address: ', partnersAgreementAddress);
  membershipAddress = await getMembershipAddress()
  return comm;
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

export const joinCommunity = async (provider, communityAddress, username, role, level) => {
  try {
    console.log('trying to join community', communityAddress);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      communityAddress,
      JSON.stringify(communityAbi),
      signer,
    );

    console.log(role, typeof role);

    const metadataJson = {
      name: `${username}'s SkillWallet`,
      description: "Universal, self-sovereign IDs tied to skills & contributions rather than personal data.",
      image: window.sessionStorage.getItem('imageUrl'),
      properties: {
        username,
        skills: [
          {
            name: role['role'],
            value: level
          }]
      }
    }
    console.log(metadataJson);

    const url = await pushJSONDocument(metadataJson)
    console.log(url);



    const createTx = await contract.joinNewMember(
      url,
      role['roleId'],
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
    // const error = err.data.message;

    const error = err
    console.log(error);
    // if (error.includes("No free spots left")) {
    //   alert("There are no available spots in this community.")
    // } else if (error.includes("Already a member")) {
    //   alert("You are already a member of this community.")
    // } else if (error.includes("SkillWallet already registered")) {
    //   alert("You already registered a SkillWallet for this wallet address.")
    // } else {
    //   alert("An error occured - please try again.")
    // }
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

export const fetchKeyAndPAByCommunity = async (community) => {
  const response = await fetch(`https://api.distributed.town/api/community/${community}/key`, {
    method: 'GET'
  })
  const pa = await response.json();
  return pa;
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

    const partnersAgreementKey = await fetchKeyAndPAByCommunity(community);
    let res = await fetch(jsonUri);
    const jsonMetadata = await res.json();
    const isCoreTeam = await isCoreTeamMember(partnersAgreementKey.partnersAgreementAddress, address);
    console.log('is core team member?', isCoreTeam);

    let skillWallet: any = {
      imageUrl: jsonMetadata.image,
      nickname: jsonMetadata.properties.username,
      skills: jsonMetadata.properties.skills,
      community: community,
      diToCredits: 0,
      tokenId: tokenId.toString(),
      isCoreTeamMember: isCoreTeam
    };

    if (skillWallet && skillWallet.nickname) {
      console.log('setting local storage with SW');
      window.sessionStorage.setItem('skillWallet', JSON.stringify(skillWallet));
    } else if (!skillWallet) {
      alert('Unable to find a Skill Wallet and nickname with your ID')
    }

    return community;
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
    return false;
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

export const getLogo = (logo, community) => {
  logo.crossOrigin = 'Anonymous';
  logo.src = community.image;
}

export const drawCanvas = (canvas, demoImg, logo, community) => {
  // console.log('inside drawCanvas');
  demoImg.width = 369;
  demoImg.height = 591;
  demoImg.crossOrigin = 'Anonymous';
  demoImg.src = 'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/sw_bg_image.png';
  const ctx = canvas.getContext('2d');
  canvas.width = 369;
  canvas.height = 591;
  // @ts-ignore
  canvas.crossOrigin = 'Anonymous';
  ctx.drawImage(demoImg, 0, 0);
  ctx.drawImage(logo, 93, 100, 186, 186);

  ctx.font = '22pt Josefin Sans';
  ctx.fillStyle = 'white';
  ctx.fillText(community.name, 25, 375);
  const tokenId = window.sessionStorage.getItem('tokenId');
  let pioneer = '';
  if (tokenId.length === 2) {
    pioneer = `Pioneer #0${tokenId}`;
  } else if (tokenId.length === 3) {
    pioneer = `Pioneer #${tokenId}`;
  } else if (tokenId.length === 1) {
    pioneer = `Pioneer #00${tokenId}`;
  }
  ctx.fillText(pioneer, 25, 440);
}

const getMembershipAddress = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    partnersAgreementAddress,
    JSON.stringify(partnersAgreementAbi),
    signer,
  );

  const memberAddress = await contract.membershipAddress();
  console.log('member addy', memberAddress);
  return memberAddress;
}

export const generateMembershipNFT = async (canvas, demoImg, logo, community, roleSelected) => {
  let url = '';
  drawCanvas(canvas, demoImg, logo, community);
  canvas.toBlob(async (blob) => {
    url = await pushImage(blob.stream(), 'membershipID.png');
    console.log(url);
  }, 'image/png');



  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log('membership addy: ', membershipAddress);
    const contract = new ethers.Contract(
      membershipAddress,
      JSON.stringify(membershipAbi),
      signer,
    );

    console.log('community: ', community);

    const mintTx = contract.create({
      "image": url,
      "title": `Membership NFT ID for joining the ${community.name} community!`,
      "role": roleSelected.role
    });

    console.log(mintTx);

} catch (err) {
  console.log('woops: ', err);
}
};

export const isCoreTeamMember = async (partnersAgreementAddress, user) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const partnersAgreementContract = new ethers.Contract(
      partnersAgreementAddress,
      JSON.stringify(partnersAgreementAbi),
      signer,
  )

  const isCoreTeamMember = await partnersAgreementContract.isCoreTeamMember(user);
  console.log('isCoreTeamMember', isCoreTeamMember);

  return isCoreTeamMember;
}

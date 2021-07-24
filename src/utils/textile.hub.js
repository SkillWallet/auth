import { Buckets } from '@textile/hub'


const keyInfo = {
  key: 'bqbeg4w4u6ewltnejxwmvu6ngwu',
  secret: 'bh24lv4dxie5dabwnl75y3onzphkvlqhyf56dlba'
}

var jsonToArray = function(json)
{
	var str = JSON.stringify(json, null, 0);
	var ret = new Uint8Array(str.length);
	for (var i = 0; i < str.length; i++) {
		ret[i] = str.charCodeAt(i);
	}
	return ret
};

export async function pushJSONDocument  (json) {
  const buckets = await Buckets.withKeyInfo(keyInfo)
  const { root, threadID } = await buckets.getOrCreate('SkillWallet')
  if (!root) throw new Error('bucket not created')
  const buf = jsonToArray(json)
  const path = `metadata.json`
  const links = await buckets.pushPath(root.key, path, buf)
  return `https://hub.textile.io${links.path.path}`;
}

export async function pushImage(content) {
  const buckets = await Buckets.withKeyInfo(keyInfo)
  const { root } = await buckets.getOrCreate('SkillWallet')
  if (!root) throw new Error('bucket not created')
  const path = `profile.png`
  const links = await buckets.pushPath(root.key, path, content)
  return `https://hub.textile.io${links.path.path}`;
}

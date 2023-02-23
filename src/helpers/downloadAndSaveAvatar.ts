import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';

export async function downloadAndSaveAvatar(
  avatarUrl: string,
): Promise<string> {
  const axiosRequest = await axios.get(avatarUrl, {
    responseType: 'arraybuffer',
  });
  const avatarHash = `${crypto.randomBytes(16).toString('hex')}.jpg`;
  const avatarPath = `${process.cwd()}/src/avatars/${avatarHash}`;
  fs.writeFileSync(avatarPath, axiosRequest.data);
  return avatarHash;
}

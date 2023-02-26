import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { downloadAndSaveAvatar } from './downloadAndSaveAvatar';

jest.mock('axios');
jest.mock('crypto');
jest.mock('fs');

describe('downloadAndSaveAvatar', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should download and save avatar successfully', async () => {
    const buffer = Buffer.from([1, 2, 3]);
    const avatarUrl = 'https://example.com/avatar.jpg';
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: buffer });
    (crypto.randomBytes as jest.Mock).mockReturnValueOnce(buffer);
    jest.spyOn(process, 'cwd').mockReturnValue('/tmp');
    (fs.writeFileSync as jest.Mock).mockReturnValueOnce(null);

    const result = await downloadAndSaveAvatar(avatarUrl);

    expect(result).toEqual(`${buffer.toString('hex')}.jpg`);
    expect(axios.get).toHaveBeenCalledWith(avatarUrl, {
      responseType: 'arraybuffer',
    });
    expect(crypto.randomBytes).toHaveBeenCalledWith(16);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/tmp/src/avatars/010203.jpg',
      buffer,
    );
  });
});

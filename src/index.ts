import SwitchbladeSDK from './switchblade';
import self from '../package.json';

const sdk = {
  name: self.name,
  version: self.version,
  description: self.description,
  author: self.author,
  repository: self.repository
}

export { SwitchbladeSDK, sdk };
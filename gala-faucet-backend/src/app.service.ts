import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import stringify from 'json-stringify-deterministic';
import { ec as EC } from 'elliptic';
import { keccak256 } from 'js-sha3';
import { BN } from 'bn.js';

const ecSecp256k1 = new EC('secp256k1');

@Injectable()
export class AppService {
  private readonly galaswapApiBaseUrl: string;
  private readonly chainApiBaseUrl: string;
  private readonly faucetMultiplier: string;
  private readonly faucetAdminPrivateKey: string;

  constructor(private configService: ConfigService) {
    this.galaswapApiBaseUrl = this.configService.get<string>('GALASWAP_API_BASE_URL');
    this.chainApiBaseUrl = this.configService.get<string>('CHAIN_API_BASE_URL');
    this.faucetMultiplier = this.configService.get<string>('FAUCET_MULTIPLIER');
    this.faucetAdminPrivateKey = this.configService.get<string>('FAUCET_ADMIN_PRIVATE_KEY');
  }

  async getBalance(walletAddress: string): Promise<number> {
    try {
      const response = await axios.post(`${this.galaswapApiBaseUrl}/galachain/api/asset/token-contract/FetchBalances`, {
        owner: walletAddress
      });

      const galaBalance = response.data.Data.find(
        (token) => token.collection === 'GALA' && token.category === 'Unit'
      );

      return galaBalance ? parseFloat(galaBalance.quantity) : 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async burnMainnetGala(signedDto: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.chainApiBaseUrl}/api/asset/token-contract/BurnTokens`, 
        signedDto, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.status === 200 || response.status === 201) {
        const quantity = parseFloat(signedDto.tokenInstances[0].quantity)

        const mintTokenDto = {
          owner: signedDto.owner,
          quantity: (quantity * parseFloat(this.faucetMultiplier)).toString(),
          tokenClass: {
            collection: "GALA",
            category: "Unit",
            type: "none",
            additionalKey: "none"
          },
          tokenInstance: "0",
          uniqueKey: `mint-${signedDto.uniqueKey}`
        }

        // sign with faucet admin credentials
        const signedMintTokenDto = signObject(mintTokenDto, this.faucetAdminPrivateKey)

        const mintResponse = await this.mintTestnetGala(signedMintTokenDto)
        
        return mintResponse
      } else {
        throw new Error(`Unexpected response: ${response.status}`)
      }
    } catch (error) {
      console.error('Error burning mainnet GALA:', error);
      throw error;
    }
  }

  async mintTestnetGala(signedDto: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.chainApiBaseUrl}/api/asset/token-contract/MintToken`, 
        signedDto, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error minting testnet GALA:', error);
      throw error;
    }
  }
}

export function signObject<TInputType extends object>(
  obj: TInputType,
  privateKey: string
): TInputType & { signature: string } {
  const toSign = { ...obj };

  if ('signature' in toSign) {
    delete toSign.signature;
  }

  const stringToSign = stringify(toSign);
  const stringToSignBuffer = Buffer.from(stringToSign);

  const keccak256Hash = Buffer.from(keccak256.digest(stringToSignBuffer));
  const privateKeyBuffer = Buffer.from(privateKey.replace(/^0x/, ''), 'hex');

  const signature = ecSecp256k1.sign(keccak256Hash, privateKeyBuffer);

  // Normalize the signature if it's greater than half of order n
  if (signature.s.cmp(ecSecp256k1.curve.n.shrn(1)) > 0) {
    const curveN = ecSecp256k1.curve.n;
    const newS = new BN(curveN).sub(signature.s);
    const newRecoverParam = signature.recoveryParam != null ? 1 - signature.recoveryParam : null;
    signature.s = newS;
    signature.recoveryParam = newRecoverParam;
  }

  const signatureString = Buffer.from(signature.toDER()).toString('base64');

  return {
    ...toSign,
    signature: signatureString,
  };
}

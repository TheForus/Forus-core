import axios, { AxiosInstance } from 'axios';

const TEE_API_URL = process.env.REACT_APP_TEE_API_URL || 'http://localhost:3001';

export interface AttestationResponse {
  valid: boolean;
  teePublicKey: string;
  measurements: string[];
  timestamp: number;
}

export interface RegisterUserRequest {
  publicKey: string;
  encryptedPrivateKey: string;
}

export interface RegisterUserResponse {
  userId: string;
  success: boolean;
}

export interface DetectedPayment {
  stealthAddress: string;
  balance: string;
  ephemeralPublicKey: string;
  blockNumber: number;
  timestamp: number;
}

export interface SignTransactionRequest {
  userId: string;
  stealthAddress: string;
  unsignedTx: {
    to: string;
    value: string;
    data?: string;
    gasLimit: string;
    gasPrice: string;
    nonce: number;
  };
}

export interface SignTransactionResponse {
  signedTx: string;
  success: boolean;
}

class TEEApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: TEE_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get TEE attestation to verify the enclave
   */
  async getAttestation(): Promise<AttestationResponse> {
    const response = await this.client.get<AttestationResponse>('/attestation');
    return response.data;
  }

  /**
   * Register user's private key with TEE
   */
  async registerUser(data: RegisterUserRequest): Promise<RegisterUserResponse> {
    const response = await this.client.post<RegisterUserResponse>(
      '/register',
      data
    );
    return response.data;
  }

  /**
   * Get detected payments for a user
   */
  async getPayments(userId: string): Promise<DetectedPayment[]> {
    const response = await this.client.get<DetectedPayment[]>(
      `/payments/${userId}`
    );
    return response.data;
  }

  /**
   * Request TEE to sign a transaction
   */
  async signTransaction(
    data: SignTransactionRequest
  ): Promise<SignTransactionResponse> {
    const response = await this.client.post<SignTransactionResponse>(
      '/sign',
      data
    );
    return response.data;
  }

  /**
   * Delete user's private key from TEE
   */
  async deleteUser(userId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete(`/user/${userId}`);
    return response.data;
  }


  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const teeApi = new TEEApiClient();
import { hash, verify } from "@node-rs/argon2";
import { Injectable } from '@nestjs/common';

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;


export interface PasswordHashingAlgorithm {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}


const v0x13 = 1;

@Injectable()
export class Argon2Id implements PasswordHashingAlgorithm {
  constructor(options?: {
    memorySize?: number;
    iterations?: number;
    tagLength?: number;
    parallelism?: number;
    secret?: ArrayBuffer | TypedArray;
  }) {
    this.memorySize = options?.memorySize ?? 19456;
    this.iterations = options?.iterations ?? 3;
    this.tagLength = options?.tagLength ?? 32;
    this.parallelism = options?.parallelism ?? 1;
    this.secret = options?.secret ?? null;
  }

  private memorySize?: number;
  private iterations?: number;
  private tagLength?: number;
  private parallelism?: number;
  private secret: ArrayBuffer | TypedArray | null;

  public async hash(password: string): Promise<string> {
    return await hash(password.normalize("NFKC"), {
      memoryCost: this.memorySize,
      timeCost: this.iterations,
      outputLen: this.tagLength,
      parallelism: this.parallelism,
      version: v0x13,
      secret: this.secret ? Buffer.from(this.secret) : undefined
    });
  }

  public async verify(hash: string, password: string): Promise<boolean> {
    return await verify(hash, password.normalize("NFKC"), {
      memoryCost: this.memorySize,
      timeCost: this.iterations,
      outputLen: this.tagLength,
      parallelism: this.parallelism,
      version: v0x13,
      secret: this.secret ? Buffer.from(this.secret) : undefined
    });
  }
}
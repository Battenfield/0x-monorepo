import { ContractAbi, Provider, TxData } from '@0xproject/types';
import * as solc from 'solc';
import * as Web3 from 'web3';
import * as yargs from 'yargs';

export enum AbiType {
    Function = 'function',
    Constructor = 'constructor',
    Event = 'event',
    Fallback = 'fallback',
}

export interface ContractArtifact {
    schemaVersion: '2.0.0';
    contractName: string;
    networks: ContractNetworks;
    versions: ContractVersions;
}

export interface ContractVersions {
    [versionName: string]: ContractVersion;
}

export interface ContractVersion {
    compiler: {
        name: 'solc';
        version: string;
        settings: solc.CompilerSettings;
    };
    sources: {
        [sourceName: string]: {
            id: number;
        };
    };
    sourceTreeHashHex: string;
    compilerOutput: solc.StandardContractOutput;
}

export interface ContractNetworks {
    [networkId: number]: ContractNetworkData;
}

export interface ContractNetworkData {
    version: string;
    address: string;
    links: {
        [linkName: string]: {
            address: string;
            version?: string;
        };
    };
    transactionHash: string;
    constructorArgs: string;
}

export interface SolcErrors {
    [key: string]: boolean;
}

export interface CliOptions extends yargs.Arguments {
    artifactsDir: string;
    contractsDir: string;
    jsonrpcUrl: string;
    networkId: number;
    gasPrice: string;
    account?: string;
    contract?: string;
    args?: string;
}

export interface CompilerOptions {
    contractsDir: string;
    artifactsDir: string;
    versionName: string;
    compilerSettings?: solc.CompilerSettings;
    specifiedContracts: Set<string>;
}

export interface BaseDeployerOptions {
    artifactsDir: string;
    networkId: number;
    versionName: string;
    defaults: Partial<TxData>;
}

export interface ProviderDeployerOptions extends BaseDeployerOptions {
    provider: Provider;
}

export interface UrlDeployerOptions extends BaseDeployerOptions {
    jsonrpcUrl: string;
}

export type DeployerOptions = UrlDeployerOptions | ProviderDeployerOptions;

export interface ContractSourceData {
    [contractName: string]: ContractSpecificSourceData;
}

export interface ContractSpecificSourceData {
    solcVersionRange: string;
    sourceHash: Buffer;
    sourceTreeHash: Buffer;
}

export interface Token {
    address?: string;
    name: string;
    symbol: string;
    decimals: number;
    ipfsHash: string;
    swarmHash: string;
}

export type DoneCallback = (err?: Error) => void;

export declare namespace Wallet {
  enum EEventType {
    TRANSACTION_ERROR = 'transactionError',
    TRANSACTION_HASH = 'transactionHash',
    RECEIPT = 'receipt',
    CONFIRMATION = 'confirmation'
  }

  enum EInteractEventType {
    GET_TRANSACTION_ERROR = 'get/transactionError',
    SEND_TRANSACTION_HASH = 'send/transactionHash',
    SEND_RECEIPT = 'send/receipt',
    SEND_CONFIRMATION = 'send/confirmation',
    CALL_RESULT = 'call/result'
  }
  interface IEvent<T> {
    type: T;
    data?: any;
    meta?: any;
  }
  interface IEthereumReceipt {
    blockHash: string;
    blockNumber: number;
    contractAddress: string;
    cumulativeGasUsed: number;
    from: string;
    gasUsed: string;
    transactionHash: string;
  }

  interface IWalletAccount {
    address: string;
    balance: number;
  }

  interface IWalletState {
    currentChainID: string;
    isBrowserWalletExist: string;
    currentAccounts: IWalletAccount[];
  }

  /**
   *  CompilerInput follows tha same format of solcjs
   *  https://github.com/ethereum/solc-js
   *  https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
   */
  interface ICompilerInput {
    language: 'Solidity';
    settings: any;
    sources: any;
  }

  interface ICompileContractActionData {
    compileArgs: ICompilerInput;
    fileId: string;
  }

  interface IEthereumAbiInput {
    name: string;
    type: string;
    components: any;
  }

  interface IEthereumAbiItem {
    type: string;
    name: string;
    inputs: IEthereumAbiInput[];
    outputs: any[];
    stateMutability: string;
    payable: boolean;
    constant: boolean;
  }

  interface ISolcSelectedContractOutput {
    abi: IEthereumAbiItem[];
    evm: {
      bytecode: {
        object: string;
        opcodes: string;
        sourceMap: string;
      };
      gasEstimation: {
        creation: {
          codeDepositCost: string;
          executionCost: string;
          totalCost: string;
        };
      };
    };
  }

  /*
   * item: according to new filesystem data structure
   *     code: raw content in string
   * path: a string list
   */
  interface ICompiledContract {
    // solcRawOutput: ISolcRawOutput;
    contractName: string;
    fileName: string;
    solcSelectedContractOutput: ISolcSelectedContractOutput;
    path: string;
  }

  interface ISolcRawOutput {
    contracts: {
      [fileName: string]: {
        [contractName: string]: ISolcSelectedContractOutput;
      };
    };
    errors: any;
    sources: any;
  }

  /**
   *  CompilerOutput
   *  if code = 0 means no errros
   *    data: follows tha same format of solcjs https://github.com/ethereum/solc-js
   *    https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
   *  elif code = 1 means something is wrong
   *    data: error message
   */
  interface ICompileContractResult {
    code: number;
    data: ISolcRawOutput | any;
  }

  interface ICompileContractSuccessActionData {
    result: ICompileContractResult;
    fileId: string;
  }

  /**
   * Deploy options passed to Metamask
   * unit only support 'wei' and 'gwei'
   */
  interface IDeployOptions {
    gasLimit: number;
    value: number;
    unit: string;
  }

  interface IDeployUiOptions {
    gasLimit: string;
    gasLimitErrorMsg: string;
    unit: string;
    value: string;
    valueErrorMsg: string;
  }

  interface IDeployContractActionData {
    contractName: string;
    solcCompiledOutput: ISolcSelectedContractOutput;
    account: IWalletAccount;
    deployOptions: IDeployOptions;
    constructorArgs: any;
    path: string;
  }

  interface IImportDeployedActionData {
    chainId: string;
    abi: IEthereumAbiItem[];
    contractName: string;
    contractAddress: string;
  }

  interface IDeployedInfo {
    abi: IEthereumAbiItem[];
    contractName: string;
    contractAddress: string;
    chainId: string;
    deployActionData?: IDeployContractActionData;
    transactionHash?: string;
    confirmed?: number;
    receipt?: IEthereumReceipt;
  }

  /**
   * item: according to new filesystem data structure
   *    code: raw content in string
   */
  interface IDeployedContract {
    deployedInfo: IDeployedInfo;
    path: string;
    error?: string;
  }

  interface IInteractContractActionData {
    interactArgs: any;
    contractAddress: string;
    abiEntryIdx: number;
    accountAddress: string;
    abi: IEthereumAbiItem[];
    chainId: string;
  }

  interface IInteractContractCallSuccessActionData {
    contractAddress: string;
    abiEntryIdx: number;
    result: any;
  }
}

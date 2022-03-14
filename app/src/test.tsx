/*
import { useState } from 'react';

import { Idl, Program, Provider, Wallet } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConfirmOptions, Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';

import idl from './idl.json';

const baseAccount = Keypair.generate(); // アカウント
const programID = new PublicKey(idl.metadata.address); // プログラムID
console.log(programID);
const opts = { preflightCommitment: 'processed' as ConfirmOptions };

export default function HelloWorld2(props: { network: string }) {
  const [value, setValue] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');
  const wallet = useAnchorWallet();

  const getProvider = async () => {
    // プロバイダーを準備
    const connection = new Connection(props.network, opts.preflightCommitment);
    const provider = new Provider(connection, wallet as Wallet, opts.preflightCommitment);
    return provider;
  };

  const initialize = async () => {
    const provider = await getProvider();
    const program = new Program(idl as Idl, programID, provider);

    try {
      // initialize関数実行
      await program.rpc.initialize('Hello World!', {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      // 状態更新
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account:', account);
      setValue(account.data.toString());
      setDataList(account.dataList);
    } catch (err) {
      console.log('Transaction error:', err);
    }
  };

  const update = async () => {
    if (!input) return;
    const provider = await getProvider();
    const program = new Program(idl as Idl, programID, provider);

    // update関数実行
    await program.rpc.update(input, { accounts: { baseAccount: baseAccount.publicKey } });

    // 状態更新
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account:', account);
    setValue(account.data.toString());
    setDataList(account.dataList);
    setInput('');
  };

  if (!wallet) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <WalletMultiButton />
      </div>
    );
  } else {
    return (
      <div className='App'>
        <div>
          {!value && <button onClick={initialize}>Initialize</button>}

          {value ? (
            <div>
              <h2>Current value: {value}</h2>
              <input
                placeholder='Add new data'
                onChange={e => setInput(e.target.value)}
                value={input}
              />
              <button onClick={update}>Add data</button>
            </div>
          ) : (
            <h3>Please Inialize.</h3>
          )}
          {dataList.map((d, i) => (
            <h4 key={i}>{d}</h4>
          ))}
        </div>
      </div>
    );
  }
}

*/
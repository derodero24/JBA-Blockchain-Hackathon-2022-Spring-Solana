import * as assert from 'assert';

import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { TansuNft } from '../target/types/tansu_nft';

describe('tansu-nft', () => {
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.TansuNft as anchor.Program<TansuNft>;

  // Creator,splToken,Tansuのキーペア
  const creator1 = program.provider.wallet;
  const creator2 = anchor.web3.Keypair.generate();

  const splToken1 = anchor.web3.Keypair.generate();
  const splToken2 = anchor.web3.Keypair.generate();

  const tansu1 = anchor.web3.Keypair.generate();
  const tansu2 = anchor.web3.Keypair.generate();

  const tansuArgs = [
    {
      creator: creator1,
      tansu: tansu1,
      original_token: splToken1.publicKey,
      inner_tokens: [],
      originals_reed_fee: 2,
    },
    {
      creator: creator2,
      tansu: tansu2,
      original_token: splToken2.publicKey,
      inner_tokens: [splToken1.publicKey],
      originals_reed_fee: 0.1,
    },
  ];

  it('Airdrop for test creators', async () => {
    // airdrop
    const signature = await program.provider.connection.requestAirdrop(
      creator2.publicKey,
      1000000000
    );
    await program.provider.connection.confirmTransaction(signature);
  });

  it('Initialize first tansu account.', async () => {
    // Tansu作成
    const args = tansuArgs[0];
    await program.rpc.initialize(args.original_token, args.inner_tokens, args.originals_reed_fee, {
      accounts: {
        tansu: args.tansu.publicKey,
        payer: args.creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [args.tansu],
    });

    // データチェック
    const tansuAccount = await program.account.tansu.fetch(args.tansu.publicKey);
    assert.equal(tansuAccount.originalToken.toBase58(), args.original_token.toBase58());
    assert.equal(tansuAccount.innerTokens.length, args.inner_tokens.length);
    assert.equal(tansuAccount.useFee, args.originals_reed_fee);
  });

  it('Initialize second tansu account.', async () => {
    // Tansu作成
    const args = tansuArgs[1];
    await program.rpc.initialize(args.original_token, args.inner_tokens, args.originals_reed_fee, {
      accounts: {
        tansu: args.tansu.publicKey,
        payer: args.creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [args.creator as anchor.web3.Keypair, args.tansu],
    });

    // データチェック
    const tansuAccount = await program.account.tansu.fetch(args.tansu.publicKey);
    assert.equal(tansuAccount.originalToken.toBase58(), args.original_token.toBase58());
    assert.equal(tansuAccount.innerTokens.length, args.inner_tokens.length);
    assert.equal(tansuAccount.useFee, args.originals_reed_fee);
  });

  it('Can fetch all tansu accounts', async () => {
    const tansuAccounts = await program.account.tansu.all();
    assert.equal(tansuAccounts.length, 2);
  });

  it('Can filter tansu by original_token', async () => {
    const tansuAccounts = await program.account.tansu.all([
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: splToken1.publicKey.toBase58(),
        },
      },
    ]);
    assert.equal(tansuAccounts.length, 1);
  });

  // it('create new tansu', async () => {
  //   // Tansu,creatorのキーペア
  //   const newCreator = program.provider.wallet;
  //   const newTansu = anchor.web3.Keypair.generate();
  //   const wrapped_tokens = [firstTansu.publicKey];

  //   // Tansu作成
  //   await program.rpc.initialize(wrapped_tokens, {
  //     accounts: {
  //       tansu: newTansu.publicKey,
  //       creator: newCreator.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     },
  //     signers: [newTansu],
  //   });

  //   // データチェック
  //   const tansuAccount = await program.account.tansu.fetch(newTansu.publicKey);
  //   console.log(tansuAccount);
  //   assert.equal(tansuAccount.creator.toBase58(), newCreator.publicKey.toBase58());
  //   assert.equal(tansuAccount.wrappedTokens.length, wrapped_tokens.length);

  //   // pay
  //   await program.rpc.pay({
  //     accounts: {
  //       tansu: newTansu.publicKey,
  //     },
  //   });
  // });
});

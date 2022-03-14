import * as assert from 'assert';

import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { TansuNft } from '../target/types/tansu_nft';

describe('tansu-nft', () => {
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.TansuNft as anchor.Program<TansuNft>;

  // Creator,Tansuのキーペア
  const firstCreator = program.provider.wallet;
  const firstTansu = anchor.web3.Keypair.generate();

  // it('Is initialized!', async () => {
  //   // Tansu,creatorのキーペア
  //   const tansuKeypair = anchor.web3.Keypair.generate();

  //   // PDA keyの作成
  //   const [mintPda, mintPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode('test'))],
  //     program.programId
  //   );
  //   // console.log(mintPda, mintPdaBump);
  //   // console.log(tansuKeypair.publicKey.toBase58());

  //   // Tansu作成
  //   await program.rpc.initialize(mintPdaBump, {
  //     accounts: {
  //       mint: mintPda,
  //       tansu: tansuKeypair.publicKey,
  //       creator: creatorPubkey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //     },
  //     signers: [tansuKeypair],
  //   });

  //   // // データチェック
  //   // const tansuAccount = await program.account.tansu.fetch(tansuKeypair.publicKey);
  //   // assert.equal(tansuAccount.creator.toBase58(), creatorPubkey.toBase58());
  // });

  it('Is initialized!', async () => {
    // Tansu作成
    const wrapped_tokens = [];
    await program.rpc.initialize(wrapped_tokens, {
      accounts: {
        tansu: firstTansu.publicKey,
        creator: firstCreator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [firstTansu],
    });

    // データチェック
    const tansuAccount = await program.account.tansu.fetch(firstTansu.publicKey);
    console.log(tansuAccount);
    assert.equal(tansuAccount.creator.toBase58(), firstCreator.publicKey.toBase58());
    assert.equal(tansuAccount.wrappedTokens.length, wrapped_tokens.length);
  });

  it('Can fetch all tansu accounts', async () => {
    const tansuAccounts = await program.account.tansu.all();
    assert.equal(tansuAccounts.length, 1);
  });

  it('Can filter tansu by creator', async () => {
    const tansuAccounts = await program.account.tansu.all([
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: firstCreator.publicKey.toBase58(),
        },
      },
    ]);
    assert.equal(tansuAccounts.length, 1);
  });

  it('create new tansu', async () => {
    // Tansu,creatorのキーペア
    const newCreator = program.provider.wallet;
    const newTansu = anchor.web3.Keypair.generate();
    const wrapped_tokens = [firstTansu.publicKey];

    // Tansu作成
    await program.rpc.initialize(wrapped_tokens, {
      accounts: {
        tansu: newTansu.publicKey,
        creator: newCreator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [newTansu],
    });

    // データチェック
    const tansuAccount = await program.account.tansu.fetch(newTansu.publicKey);
    console.log(tansuAccount);
    assert.equal(tansuAccount.creator.toBase58(), newCreator.publicKey.toBase58());
    assert.equal(tansuAccount.wrappedTokens.length, wrapped_tokens.length);
  });
});

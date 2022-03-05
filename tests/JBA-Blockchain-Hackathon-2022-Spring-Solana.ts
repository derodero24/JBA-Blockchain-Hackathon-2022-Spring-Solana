import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { JbaBlockchainHackathon2022SpringSolana } from "../target/types/jba_blockchain_hackathon_2022_spring_solana";

describe("JBA-Blockchain-Hackathon-2022-Spring-Solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.JbaBlockchainHackathon2022SpringSolana as Program<JbaBlockchainHackathon2022SpringSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});

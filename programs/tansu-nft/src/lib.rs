use anchor_lang::prelude::*;
use anchor_lang::Accounts;

declare_id!("3nLgLxquBkVFH3AKKraAa95LG2UAv6c5dpTXAB5yvuHU");

#[program]
pub mod tansu_nft {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, wrapped_tokens: Vec<Pubkey>) -> Result<()> {
        let tansu = &mut ctx.accounts.tansu;
        let creator = &ctx.accounts.creator;
        tansu.creator = *creator.key;
        tansu.wrapped_tokens = wrapped_tokens;

        msg!("hello");
        Ok(())
    }
}

#[derive(Accounts)]
// #[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(init, payer = creator, space = Tansu::LEN)]
    pub tansu: Account<'info, Tansu>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Tansu {
    pub creator: Pubkey,
    pub wrapped_tokens: Vec<Pubkey>,
}
const DISCRIMINATOR_LENGTH: usize = 8;
const CREATOR_LENGTH: usize = 32;
const WRAPPED_TOKENS_LENGTH: usize = 32 * 5;
impl Tansu {
    const LEN: usize = DISCRIMINATOR_LENGTH + CREATOR_LENGTH + WRAPPED_TOKENS_LENGTH;
}

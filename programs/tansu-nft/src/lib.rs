use anchor_lang::prelude::*;
use anchor_lang::Accounts;

declare_id!("3nLgLxquBkVFH3AKKraAa95LG2UAv6c5dpTXAB5yvuHU");

#[program]
pub mod tansu_nft {
    use super::*;
    pub fn initialize(
        ctx: Context<Initialize>,
        original_token: Pubkey,
        inner_tokens: Vec<Pubkey>,
        use_fee: f64,
    ) -> Result<()> {
        let tansu = &mut ctx.accounts.tansu;
        tansu.original_token = original_token;
        tansu.inner_tokens = inner_tokens;
        tansu.use_fee = use_fee;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = Tansu::LEN)]
    pub tansu: Account<'info, Tansu>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Tansu {
    pub original_token: Pubkey,
    pub inner_tokens: Vec<Pubkey>,
    pub use_fee: f64,
}
impl Tansu {
    const LEN: usize = 8 // discriminator
        + 32 // original_token
        + 32 * 5 // inner_tokens (最大5つ)
        + 16; // fee
}

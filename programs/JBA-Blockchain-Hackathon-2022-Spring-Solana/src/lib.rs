use anchor_lang::prelude::*;

declare_id!("AdENrMBJjcxGdbWspFtRjNELs467EmcecLgKdG9pcug4");

#[program]
pub mod jba_blockchain_hackathon_2022_spring_solana {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 64 + 64)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[account]
pub struct BaseAccount {
    pub data: String,
}

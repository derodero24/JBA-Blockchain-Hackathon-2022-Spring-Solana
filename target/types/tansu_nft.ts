export type TansuNft = {
  version: '0.1.0';
  name: 'tansu_nft';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        {
          name: 'tansu';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'originalToken';
          type: 'publicKey';
        },
        {
          name: 'innerTokens';
          type: {
            vec: 'publicKey';
          };
        },
        {
          name: 'useFee';
          type: 'f64';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'tansu';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'originalToken';
            type: 'publicKey';
          },
          {
            name: 'innerTokens';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'useFee';
            type: 'f64';
          }
        ];
      };
    }
  ];
};

export const IDL: TansuNft = {
  version: '0.1.0',
  name: 'tansu_nft',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'tansu',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'originalToken',
          type: 'publicKey',
        },
        {
          name: 'innerTokens',
          type: {
            vec: 'publicKey',
          },
        },
        {
          name: 'useFee',
          type: 'f64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'tansu',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'originalToken',
            type: 'publicKey',
          },
          {
            name: 'innerTokens',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'useFee',
            type: 'f64',
          },
        ],
      },
    },
  ],
};

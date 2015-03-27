module.exports = {
	vanillaUser: {
		email:        'McTESTERTESTEBERGERVANILLA@googlemail.com',
		username:     'MIJOTHY',
		first_name:   'MIJ',
		last_name:    'JIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958424331',

		admin_rights : false,
		github_link: 'https://api.github.com/users/MIJOTHY',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106320?v=3',

		membership_active_status: false,

		desk_authorization: false,

		desk_rental_rate:   5000, //rate of desk (e.g 50/100/200)
		desk_rental_status: {},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	},
	adminUser: {
		email:        'McTESTERTESTEBERGERADMIN@googlemail.com',
		username:     'TIMOTHYADMIN',
		first_name:   'MIT',
		last_name:    'TIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958454331',

		admin_rights : true,
		github_link: 'https://api.github.com/users/TIMOTHY',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106321?v=3',

		membership_active_status: false,

		desk_authorization: false,

		desk_rental_rate:   5000, //rate of desk (e.g 50/100/200)
		desk_rental_status: {},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	},
	memberUser: {
		email:        'McTESTERTESTEBERGERMEMBER@googlemail.com',
		username:     'TIMOTHYMEMBER',
		first_name:   'MIT',
		last_name:    'TIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958454331',

		admin_rights : true,
		github_link: 'https://api.github.com/users/TIMOTHYMEMBER',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106321?v=3',

		membership_active_status: true,
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)", // date paid

		desk_authorization: false,

		desk_rental_rate:   5000, //rate of desk (e.g 50/100/200)
		desk_rental_status: {},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	},
	desk5000User: {
		email:        'McTESTERTESTEBERGERDESK5000@googlemail.com',
		username:     'TIMOTHYDESK5000',
		first_name:   'MIT',
		last_name:    'TIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958454331',

		admin_rights : true,
		github_link: 'https://api.github.com/users/TIMOTHYDESK5000',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106321?v=3',

		membership_active_status: true,
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)", // date paid

		desk_authorization: true,

		desk_rental_rate:   5000, //rate of desk (e.g 50/100/200)
		desk_rental_status: {
			2015: {
				0:  {type: String, required: true, default: "unpaid"},
				1:  {type: String, required: true, default: "unpaid"},
				2:  {type: String, required: true, default: "unpaid"},
				3:  {type: String, required: true, default: "unpaid"},
				4:  {type: String, required: true, default: "unpaid"},
				5:  {type: String, required: true, default: "unpaid"},
				6:  {type: String, required: true, default: "unpaid"},
				7:  {type: String, required: true, default: "unpaid"},
				8:  {type: String, required: true, default: "unpaid"},
				9:  {type: String, required: true, default: "unpaid"},
				10: {type: String, required: true, default: "unpaid"},
				11: {type: String, required: true, default: "unpaid"},
			}
		},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [],
		message_history: [messageSchema]
	},
	desk10000User: {
		email:        'McTESTERTESTEBERGERDESK10000@googlemail.com',
		username:     'TIMOTHYDESK10000',
		first_name:   'MIT',
		last_name:    'TIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958454331',

		admin_rights : true,
		github_link: 'https://api.github.com/users/TIMOTHYDESK10000',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106321?v=3',

		membership_active_status: true,
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)", // date paid

		desk_authorization: true,

		desk_rental_rate:   10000, //rate of desk (e.g 50/100/200)
		desk_rental_status: {},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	},
	desk20000User: {
		email:        'McTESTERTESTEBERGERDESK20000@googlemail.com',
		username:     'TIMOTHYDESK20000',
		first_name:   'MIT',
		last_name:    'TIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958454331',

		admin_rights : true,
		github_link: 'https://api.github.com/users/TIMOTHYDESK20000',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106321?v=3',

		membership_active_status: true,
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)", // date paid

		desk_authorization: true,

		desk_rental_rate:   20000, //rate of desk (e.g 50/100/200)
		desk_rental_status: {},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	},
};


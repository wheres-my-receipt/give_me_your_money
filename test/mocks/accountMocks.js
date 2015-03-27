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

		desk_rental_rate:   5000,
		desk_rental_status: {}
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

		desk_rental_rate:   5000,
		desk_rental_status: {}
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
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",

		desk_authorization: false,

		desk_rental_rate:   5000,
		desk_rental_status: {}
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
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",

		desk_authorization: true,

		desk_rental_rate:   5000,
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
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",

		desk_authorization: true,

		desk_rental_rate:   10000,
		desk_rental_status: {}
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
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",

		desk_authorization: true,

		desk_rental_rate:   20000,
		desk_rental_status: {}
	},
	deskPaidUser: {
		email:        'McTESTERTESTEBERGERDESKPaid@googlemail.com',
		username:     'TIMOTHYDESK5000',
		first_name:   'MIT',
		last_name:    'TIM',
		member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
		phone_number: '07958454331',

		admin_rights : true,
		github_link: 'https://api.github.com/users/TIMOTHYDESKPaid',
		github_avatar: 'https://avatars.githubusercontent.com/u/10106321?v=3',

		membership_active_status: true,
		membership_paid: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",

		desk_authorization: true,

		desk_rental_rate:   5000,
		desk_rental_status: {
			2015: {
				0:  "away",
				1:  "away",
				2:  "paid",
				3:  "unpaid",
				4:  "unpaid",
				5:  "unpaid",
				6:  "unpaid",
				7:  "unpaid",
				8:  "unpaid",
				9:  "unpaid",
				10: "unpaid",
				11: "unpaid",
			}
		},

		automated_emails: [automatedEmailSchema],
		transaction_history:  [],
		message_history: [messageSchema]
	},
	thuggish_ruggish : {
	    "email": "McTESTERTESTEBERGER@googlemail.com",
	    "username": "MIJOTHY",
	    "first_name": "jogn",
	    "last_name": "Stark",
	    "member_since": "2015-03-27T00:41:31.339Z",
	    "phone_number": "07958424331",
	    "github_link": "https://api.github.com/users/MIJOTHY",
	    "github_avatar": "https://avatars.githubusercontent.com/u/10106320?v=3",
	    "membership_paid": "2016-03-27T08:02:10.000Z",
	    "message_history": [
	        {
	            "to": "McTESTERTESTEBERGER@googlemail.com",
	            "from": "facmembershipadmin@gmail.com",
	            "date": "March 27th 2015",
	            "subject": "Thank you for your payment!",
	            "text": "Hello jogn! Thank you for your payment!",
	        },
	        {
	            "to": "McTESTERTESTEBERGER@googlemail.com",
	            "from": "facmembershipadmin@gmail.com",
	            "date": "March 27th 2015",
	            "subject": "Thank you for your payment!",
	            "text": "Hello jogn! Thank you for your payment!",
	        }
	    ],
	    "transaction_history": [
	        {
	            "name": "mctestertesteberger@googlemail.com",
	            "date": "2015-03-27T09:02:10.000Z",
	            "amount": "5000",
	            "type": "membership",
	        },
	        {
	            "name": "mctestertesteberger@googlemail.com",
	            "date": "2015-03-27T09:04:29.000Z",
	            "amount": "5000",
	            "type": "membership",
	        }
	    ],
	    "automated_emails": [],
	    "desk_rental_status": {
	        "2015": {
	            "0": "away",
	            "1": "away",
	            "2": "unpaid",
	            "3": "unpaid",
	            "4": "unpaid",
	            "5": "unpaid",
	            "6": "unpaid",
	            "7": "unpaid",
	            "8": "unpaid",
	            "9": "unpaid",
	            "10": "unpaid",
	            "11": "unpaid",
	        }
	    },
	    "desk_rental_rate": 5000,
	    "desk_authorization": true,
	    "membership_active_status": true,
	    "admin_rights": true
	}
};


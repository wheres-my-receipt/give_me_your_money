module.exports = {
	user1: {
		email: 'McTESTERTESTEBERGER@googlemail.com',
	  username: 'MIJOTHY',
	  first_name: 'Tony',
	  last_name: 'Stark',
	  member_since: "Thu Mar 26 2015 12:16:26 GMT+0000 (GMT)",
	  phone_number: '07958424331',
	  github_link: 'https://api.github.com/users/MIJOTHY',
	  github_avatar: 'https://avatars.githubusercontent.com/u/10106320?v=3',
	  __v: 0,
	  message_history: [],
	  transaction_history: [],
	  desk_rental_status:
	   { '115':
	      { '0': 'away',
	        '1': 'away',
	        '2': 'unpaid',
	        '3': 'unpaid',
	        '4': 'unpaid',
	        '5': 'unpaid',
	        '6': 'unpaid',
	        '7': 'unpaid',
	        '8': 'unpaid',
	        '9': 'unpaid',
	        '10': 'unpaid',
	        '11': 'unpaid',
	        _id: "5513f89a4c07b720239b4b70" } },
	  desk_rental_rate: 5000,
	  desk_authorization: false,
	  membership_active_status: false,
	  admin_rights: false
	},
	user2: {
		email:        {type: String, required: true, unique: true},
		username:     {type: String, required: true, unique: true},
		first_name:   {type: String, required: true},
		last_name:    {type: String, required: true},
		member_since: {type: Date, required: true},
		phone_number: {type: String, required: true},

		admin_rights : {type: Boolean, required: true, default: false},
		github_link: {type: String, required: true, unique: true},
		github_avatar: {type: String, required: true},

		membership_active_status: {type: Boolean, required: true, default: false},
		membership_paid: {type: Date}, // date paid

		desk_authorization: {type: Boolean, required: true, default: false},

		desk_rental_rate:   {type: Number, required: true, default: 5000}, //rate of desk (e.g 50/100/200)
		desk_rental_status: {type: Object, required: true, default: {}},

		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	}
};


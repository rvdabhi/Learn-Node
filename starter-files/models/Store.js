const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // promise for we can wait for data to be come from database

const slug = require('slugs');

const storeSchema = new mongoose.Schema({
	name:{
		type: String, 
		trim: true,
		required: "Please enter a store name!"
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tags: [String]
});

storeSchema.pre('save', function(next) 
{
	if(!this.isModified('name'))
	{
		next(); // skip it
		return; // stop this function from running
	}

	this.slug = slug(this.name);
	next();
});

// to make importable in other files
module.exports = mongoose.model("Store", storeSchema);
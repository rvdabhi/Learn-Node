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
	tags: [String],
	created: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [
			{
				type: Number,
				required: "You must suply coordinates!"
			}
		],
		address: {
			type: String,
			required: "You must suply an address!"
		}
	},
	photo: String,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author'
	}
});

// Define our indexes
storeSchema.index({
	name: 'text',
	description: 'text'
});

storeSchema.index({
	location: '2dsphere'
});

storeSchema.pre('save', async function(next) 
{
	if(!this.isModified('name'))
	{
		next(); // skip it
		return; // stop this function from running
	}

	this.slug = slug(this.name);

	// find other stores for duplicate slug entry
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*)?)$`, 'i');
	const storesWithSlug = await this.constructor.find({slug: slugRegEx});

	if(storesWithSlug.length) {
		this.slug = `${this.slug}-${storesWithSlug.length + 1}`
	}

	next();
});

storeSchema.statics.getTagsList = function() {
	return this.aggregate([
		{ $unwind: '$tags' },
		{ $group: { _id: '$tags', count: { $sum: 1 } }},
		{ $sort: { count: -1}}
	]);
}

// to make importable in other files
module.exports = mongoose.model("Store", storeSchema);
const mongoose = require("mongoose");
const { pastes } = require("./connections");

class databaseManager {
	// return all pastes
	async getAllPastes() {
		return await pastes.find({});
	}

	//return only what search term is inside of
	async getPastesByName(searchTerm,currentPastesLength) {
		currentPastesLength = +currentPastesLength < 20 ? 0 : currentPastesLength
		return await pastes.find({ title: { $regex: searchTerm, $options: "i" } }).skip(currentPastesLength).limit(20);
	}

	async getPasteByTerm(term,currentPastesLength){
		let regexExp = null
		if(term){
			regexExp = Array.from(term).join('|')
			return await pastes.find({ $or:[{ title: { $regex: regexExp, $options: "i" } }] })
		}else return null

	}

	async getAllTagsCount() {
		return await pastes.aggregate([
			{ $project: { tags: 1 } },
			{ $unwind: { path: "$tags" } },
			{
				$group: {
					_id: "$tags",
					sum: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					tag: "$_id",
					sum: 1,
				},
			},
		]);
	}
}

module.exports = databaseManager;

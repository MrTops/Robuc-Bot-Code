/*

    Definitions of the types

*/
const { Rarity } = require('./types/Rarity');

module.exports.Rarities = [
    new Rarity('common', 1, 3, 9500),
    new Rarity('uncommon', 3, 5, 450),
    new Rarity('epic', 6, 8, 25, "🟪"),
    new Rarity('legendary', 10, 15, 20, "🟧"),
    new Rarity('ultra', 20, 25, 5, "🟥"),
    new Rarity('super-ultra-mega', 200, 400, 1, "🔹")
];

module.exports.getRandomRarity = () => {
    let weighted = [];
    for (var i = 0; i < this.Rarities.length; i++) {
        for (var n = 0; n < this.Rarities[i].weight; n++){
            weighted.push(i);
        }
    }

    return this.Rarities[weighted[Math.floor(Math.random() * weighted.length)]]
};

/*module.exports.test = () => {
    let results = {};
    for (var i = 0; i < 100000; i++) {
        let random = this.getRandom()
        if(!results[random.name]) results[random.name] = 0;
        results[random.name]++;
    }
    return results
};*/
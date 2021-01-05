const Discord = require("discord.js");

/**
 * @param {Discord.Client} client 
 * @returns {void}
 */
function ready(client) {
    console.log("[Ready] Logado como " + client.user.tag + " âs " + new Date());
}

module.exports = { ready };
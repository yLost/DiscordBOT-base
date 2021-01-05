const Discord = require("discord.js");

/**
 * @param {Discord.Client} client 
 * @param {Discord.GuildMember} guildMember 
 * @returns {void}
 */
function guildMemberAdd(client, guildMember) {
    console.log("[+] Usuário '" + guildMember.user.tag + "' entrou no servidor '" + guildMember.guild.id + "'");
}
/**
 * @param {Discord.Client} client 
 * @param {Discord.GuildMember} oldGuildMember 
 * @param {Discord.GuildMember} newGuildMember 
 * @returns {void}
 */
function guildMemberUpdate(client, oldGuildMember, newGuildMember) {
    if (oldGuildMember && newGuildMember) {
        if (oldGuildMember.nickname != newGuildMember.nickname) {
            console.log("Usuário " + oldGuildMember.id + " trocou de nick de " + oldGuildMember.nickname + " para " + newGuildMember.nickname)
        }
    }
}

/**
 * @param {Discord.Client} client 
 * @param {Discord.GuildMember} guildMember 
 * @returns {void}
 */
function guildMemberRemove(client, guildMember) {
    console.log("[-] Usuário '" + guildMember.user.tag + "' saiu do servidor '" + guildMember.guild.id + "'");
}

module.exports = { guildMemberRemove, guildMemberAdd, guildMemberUpdate };
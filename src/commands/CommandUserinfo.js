const Discord = require("discord.js");

module.exports = {
	name: "help",
	aliases: ["ajuda", "helpme"],
	/**
	 * @param {Discord.Client} client Client para manipulação de Shard's e gerenciamento de bot
	 * @param {Discord.Guild} guild Servidor onde o comando foi executado
	 * @param {Discord.User} user Usuário que executou o comando
	 * @param {Discord.TextChannel} channel Canal onde o comando foi executado
	 * @param {Array<String>} args Conteúdo que foi passado ao executar o comando
	 * @returns {void}
	 */
	execute: async function (client, guild, user, channel, args) {
		channel.send(new Discord.MessageEmbed()
			.addField(`:bookmark: Tag do Discord:`, `\`${user.tag}\``, true)
			.addField(`:computer: ID do Discord:`, `\`${user.id}\``, true)
			.setFooter(`Informações de Usuário - ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 2048 })));
	}
}

const Discord = require("discord.js");
const client = new Discord.Client();
const { Events } = require("./node_modules/discord.js/src/util/Constants.js");
require("dotenv").config();

client.login(process.env.TOKEN);

/**
 * A forma com que registro o prefix do bot está em hardcode, mas é só adicionar um arquivo de configuração caso desejar.
 */
const BOT_PREFIX = "s!";

/**
 * Variável para definição se o usuário do qual utilizar o comando necessita executar o comando com o prefixo exatamente igual ao definido
 * Caso TRUE
 *      ✖ S!help
 * 	   	✔ s!help 
 * 
 * Caso FALSE
 *      ✔ S!help
 * 	   	✔ s!help 
 */
const caseSensitive = true;

client.on("ready", () => {
    /**
     * Inicializando os comandos que foram registrados
     * Não há a necessidade de colocar as funções acima do evento "Ready",
     * pois o bot leva no minimo 2 segundos para enviar o evento antes disso as funções já estarão registradas
     */
    registerCommands();
});

client.on("message", message => {
    const guild = message.guild;

    /**
     * Pode ocorrer de a variável "guild" vir NULL/UNDEFINED por alguma falha dentro da API ou pelo próprio
     * servidor não estar disponível por isso adicionamos as duas verificações
     */
    if (!guild || !guild.available) {
        return;
    }

    handleCommand(client, guild, message);
});

/**
 * Lista com a importação de todos os arquivos que possuem eventos
 * O nome das funções precisam ter o mesmo nome do evento para que o sistema encontre o mesmo
 */
const events = [
    require("./src/server/ServerListener.js"),
    require("./src/server/ServerManager.js"),
];

/**
 * Função para registrar os eventos que estão na lista
 */
function listenEvents() {
    // Object com a lista de eventos que o Discord aceita
    const obj = Object.keys(Events);
    for (let i = 0; i < obj.length; i++) {
        // Evento unitário
        const eventName = Events[obj[i]];


        for (let j = 0; j < events.length; j++) {
            // Evento que foi declarado
            const rEvent = events[j];

            if (rEvent[eventName] != null && typeof (rEvent[eventName]) == "function") {
                // Chamando a função de acordo com o evento passando como argumento inicial o "Client" que é necessário quando utilizado Shard's
                client.on(eventName, (...args) => {
                    rEvent[eventName].call(this, ...[client, ...args]);
                });
            }
        }
    }
}
listenEvents();

const commands = new Map();
/**
 * Uma lista com a importação de todos os comandos que serão registrados no bot.
 * Particularmente eu gosto dessa forma, há uma liberdade maior de quais comandos deseja que funcionem ou não,
 * e é a forma com que sempre trabalhei e estou acostumado.
 */
const preCommands = [
    require("./src/commands/CommandAvatar.js"),
    require("./src/commands/CommandUserinfo.js")
];

function registerCommands() {
    // Verificamos se a lista de comandos é uma array, para ter certeza que nossas propriedades funcionem como desejado
    if (Array.isArray(preCommands)) {
        for (let i = 0; i < preCommands.length; i++) {
            // uma variável apenas para facilitar a utilização do valor atual
            const command = preCommands[i];

            // Verificamos se o arquivo importado tem um valor "name" exportado que será registrado como o nome do comando
            if (command.name == null || typeof (command.name) != "string") {
                continue;
            }
            // E se há a função "execute" onde terá toda a ação de execução do comando
            if (command.execute == null || typeof (command.execute) != "function") {
                console.log("[Command] The '" + command.name + "' hasn't execute function!");
            }
            commands.set(command.name.toLowerCase(), command);

            // Registrar aliases é opcional então o comando será registrado mesmo que não tenha nenhuma variável de aliases exportada
            if (command.aliases != null && Array.isArray(command.aliases) && command.aliases.length > 0) {
                for (let j = 0; j < command.aliases.length; j++) {
                    const alias = command.aliases[j];
                    if (alias != null && alias.length > 0) {
                        commands.set(alias.toLowerCase(), command);
                    }
                }
            }
            console.log("[Command] Command '" + command.name + "' was registered!");
        }
    }
}

/**
 * @param {Discord.Client} client 
 * @param {Discord.Guild} guild 
 * @param {Discord.Message} message 
 * @returns {void}
 * 
 * Aqui é o onde a mágica acontece, fazendo todas as verificações para ter certeza que é um comando.
 */
function handleCommand(client, guild, message) {
    // A variável do caseSensitive se encaixa aqui, para a verificação de prefixo do comando
    const isCommand = caseSensitive ? message.content.startsWith(BOT_PREFIX) : message.content.toLowerCase().statsWith(BOT_PREFIX);

    if (isCommand) {

        // Pegamos o conteúdo da mensagem e removemos o prefix
        const content = message.content.slice(BOT_PREFIX.length);
        // Convertemos em array
        const split = content.split(" ");

        /** 
         * Removemos apenas o prefixo do conteúdo da mensagem e temos uma array com todo ele separado
         * o primeiro valor da array é o comando que executamos como por exemplo:
         * 
         *   ban #usuario motivo da punição
         *    0     1       2    3      4
         * 
         * O comando que será executado não importa a forma de digitar pois fazemos a conversão para lowerCase
         * exatamente igual ao método de registro, possibilitando utilizá-los sem CaseSensitive
         */
        const commandName = split[0].toLowerCase();

        // E os argumentos retirando o primeiro valor ("ban")
        const args = split.slice(1);

        // Varificamos se o comando ("ban") que o usuário digitou está na lista de comandos registrados
        if (commands.has(commandName)) {
            const command = commands.get(commandName);

            try {
                // executamos os comandos passando as propriedades necessárias para qualquer tipo de ação no mesmo.
                command.execute(client, guild, message.author, message.channel, args);
            } catch (exc) {
                console.log("[Command] Failed to execute command '" + command.name + "', because: " + exc);
            }
        }
    }
}
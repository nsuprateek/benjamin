const { Client, Intents} = require('discord.js');
const { 
    createAudioPlayer, 
    createAudioResource, 
    joinVoiceChannel,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection } = require('@discordjs/voice');

require('dotenv').config();
const token = process.env.DISCORD_TOKEN;


const bot = new Client({ intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES
] });
    
bot.login(token);


// When the bot is ready, run this code (only once)
bot.once('ready', () => {
    console.log('Ready!');
    // console.log(bot.guilds.cache.get('732149663456559164'));
    // console.log(bot.channels.cache.get('732149664131973136'));    
});

const soundfile = 'Sounds/ben.mp3';


let voiceChannel;
bot.on('voiceStateUpdate', (oldState, newState) => {

    voiceChannel = newState.channel;
    
    if (oldState.channel == voiceChannel) return;
    
    memberName = newState.member.nickname == null? newState.member.displayName:newState.member.nickname;
    if (memberName.match(/([Bb]en)|( ?[jJ]am{1,2}in)/) == null) return;

    if (voiceChannel != null && newState.member.id != bot.user.id) {
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


bot.on('messageCreate', ()=> {

});

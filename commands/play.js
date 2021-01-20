const ytdl = require('discord-ytdl-core');
const YouTube = require('youtube-sr');
const Discord = require('discord.js');

module.exports = {
	name: 'play',
	summary: 'Play a song',
	description: 'Play a song\nYou can search for songs by inputting a query or you can use a youtube link to get your song',
	category: 'music',
	aliases: ['song', 'p', 'music'],
	args: true,
	usage: '<search query or link>',

	async execute(message, args, msgUser, client, logger) {
		const embed = new Discord.MessageEmbed()
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(client.characterCommands.getColour(msgUser));

		if (!message.member.voice.channel) return message.channel.send(embed.setDescription('you are not in a voice channel.'));

		const search = args.join(' ');
		const data = client.music.active.get(message.guild.id) || {};

		try {
			if (!data.connection) {
				const permissions = message.member.voice.channel.permissionsFor(message.guild.member(client.user));
				if (!permissions.any('CONNECT')) {
					logger.warn('Neia couldnt join the voice channel');
					return message.reply('Neia does not have permission to join the voice channel!');
				}

				data.connection = await message.member.voice.channel.join();
			}
			else if (data.connection.status == 4) {
				data.connection = await message.member.voice.channel.join();
				const guildIDData = client.music.active.get(message.guild.id);
				guildIDData.dispatcher.emit('finish');
			}
		}
		catch (error) {
			logger.warn('Neia couldnt join the voice channel');
			return message.reply('Something went wrong when joining the voice channel');
		}


		if (!data.queue) data.queue = [];
		if (data.queue.length >= 5) return message.channel.send(embed.setDescription('You have reached the maximum queue size for free users.\nIf you want to upgrade your queue size contact OverlordOE#0717.'));
		data.guildID = message.guild.id;

		const tempMessage = await message.channel.send('Finding youtube video...');
		let video;

		if (ytdl.validateURL(search)) {
			const info = await ytdl.getBasicInfo(search);
			video = info.videoDetails;
			let duration = 0;

			const minutes = Math.floor(video.lengthSeconds / 60);
			const seconds = video.lengthSeconds - (minutes * 60);
			if (seconds < 10) duration = `${minutes}:0${seconds}`;
			else duration = `${minutes}:${seconds}`;
			data.queue.push({
				songTitle: video.title,
				requester: message.author,
				url: video.video_url,
				announceChannel: message.channel.id,
				duration: duration,
				thumbnail: video.thumbnail.thumbnails[0].url,
			});
			embed.setThumbnail(video.thumbnail.thumbnails[0].url);
		}
		else {
			video = await YouTube.searchOne(search);
			if (video) {
				data.queue.push({
					songTitle: video.title,
					requester: message.author,
					url: video.url,
					announceChannel: message.channel.id,
					duration: video.durationFormatted,
					thumbnail: video.thumbnail.url,
				});
				embed.setThumbnail(video.thumbnail.url);
			}
			else {
				logger.warn(`Could not find youtube video with search terms "${search}"`);
				tempMessage.delete();
				return message.channel.send(embed.setDescription(`Neia could not find any video connected to the search terms of \`${search}\``));
			}
		}

		tempMessage.delete();
		if (!data.dispatcher) Play(client, data, logger, msgUser, message);
		else message.channel.send(embed.setDescription(`Added **${video.title}** to the queue.\n\nRequested by ${message.author}`));

		client.music.active.set(message.guild.id, data);
	},
};


async function Play(client, data, logger, msgUser, message) {

	const channel = client.channels.cache.get(data.queue[0].announceChannel);
	const embed = new Discord.MessageEmbed()
		.setThumbnail(data.queue[0].thumbnail);

	channel.send(embed.setDescription(`Now playing **${data.queue[0].songTitle}**\nRequested by ${data.queue[0].requester}`));

	data.dispatcher = data.connection.play(ytdl(data.queue[0].url, {
		filter: 'audioonly',
		highWaterMark: 1 << 25,
		opusEncoded: true,
	}), { type: 'opus' });
	data.dispatcher.guildID = data.guildID;


	data.dispatcher.on('finish', () => Finish(client, data.dispatcher, logger, msgUser, message));
	data.dispatcher.on('error', e => {
		channel.send(embed.setDescription(`error:  ${e.info}`));
		logger.error(e.stack);
	});
	data.dispatcher.on('failed', e => {
		channel.send(embed.setDescription('error:  failed to join voice channel'));
		logger.log('error', `failed to join voice channel for reason: ${e.info}`);
	});
	data.dispatcher.on('disconnect', e => {
		data.dispatcher = null;
		logger.log('info', `left voice channel for reason: ${e.info}`);
	});
}


function Finish(client, dispatcher, logger, msgUser, message) {

	const fetchedData = client.music.active.get(dispatcher.guildID);
	fetchedData.queue.shift();

	if (fetchedData.queue.length > 0) {
		client.music.active.set(dispatcher.guildID, fetchedData);
		Play(client, fetchedData, logger, msgUser, message);
	}

	else {
		client.music.active.delete(dispatcher.guildID);
		const voiceChannel = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
		if (voiceChannel) voiceChannel.leave();
	}
}

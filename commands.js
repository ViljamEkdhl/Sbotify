//const showResults = require('./showResults.js');
const { changeRatio } = require('./showResults.js');
const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');

module.exports = {
    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction, client){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        //await showResults.displayMusicTierList(client);
    };
    if(commandName === 'showresult'){
        const channel = Interaction.options.getChannel('destination');
        const setting = Interaction.options.getString('settings');
        //console.log(Interaction);
        if (await changeRatio(Interaction, channel) === false){
            await Interaction.reply('Unable to change setting due to it already being the active setting!');
        }else{
            console.log(channel);
            //await showResults.displayMusicTierList(channel);
            await Interaction.reply('Setting was successfully changed!');
        }
    };
    if(commandName === 'canvas'){
        const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./canvas.jpg');

        // This uses the canvas dimensions to stretch the image onto the entire canvas
	    context.drawImage(background, 0, 0, canvas.width, canvas.height);
        console.dir(canvas);

        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Select the font size and type from one of the natively available fonts
        context.font = '60px sans-serif';
    
        // Select the style that will be used to fill the text in
        context.fillStyle = '#7BE0E6';
    
        // Actually fill the text with a solid color
        for (let index = 0; index < 5; index++) {
            context.fillText(index.toLocaleString(), canvas.width / 2.5, canvas.height / 1.8);
        }


	    // Use the helpful Attachment class structure to process the file for you
	    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');


        Interaction.reply({ files: [attachment] });
    }
   },
}
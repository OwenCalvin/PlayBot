const discord = require('discord.js')
const client = new discord.Client()

let maxValue = 10
let firstChar = '$'
let takes = []
let goodRes = null

client.on('message', msg => {
  let channelName = msg.channel.name
  if(channelName[channelName.length - 1] === '-') {
    msg.delete()
  }

  msgContent = msg.content.toLowerCase()
  args = msgContent.split(' ')

  if(args[0].startsWith(firstChar)) {
    switch(args[0].substr(1)) {
      case 'q':
      case 'quizz':
        goodRes = joinArray(args, 1)
        break

      case 'a':
      case 'answer':
        if(goodRes) {
          if(goodRes === joinArray(args, 1)) {
            msg.channel.send('Yes it is !')
            goodRes = null
          } else {
            msg.channel.send('No...')
          }
        } else {
          msg.channel.send('No quizz')
        }
        break

      case 'qreset':
        if(goodRes) {
            goodRes = null
        } else {
          msg.channel.send('No quizz set')
        }
        break

      case 'p':
      case 'play':
        if(isInteger(args[1]) && isInteger(args[2])) {
          msg.channel.send(`You played at ${args[1]} ${args[2]}`)
        } else {
          msg.channel.send('Enter two numerics values')
        }
        break

      case 'c':
      case 'config':
          if(isInteger(args[1])) {
            maxValue = args[1]
            msg.channel.send(`The max value are set: ${maxValue}`)
          } else {
            msg.channel.send('Enter one numeric value')
          }
        break

      case 't':
      case 'take':
        let played = false
        let same = false
        for(let i in takes) {
          played = takes[i].username == msg.author.username
          same = takes[i].value == parseInt(args[1])
        }
        if(!played) {
          if(!same) {
            if(isInteger(args[1])) {
              if(parseInt(args[1]) >= 1 && parseInt(args[1]) <= maxValue) {
                takes.push({
                  username: msg.author.username,
                  value: args[1]
                })
                msg.channel.send(`${msg.author.username} you choose: ${args[1]}`)
              } else {
                msg.channel.send(`${msg.author.username}, enter a value between 0 and ${maxValue}`)
              }
            } else {
              msg.channel.send(`${msg.author.username}, enter one numeric value`)
            }
          } else {
            msg.channel.send(`${msg.author.username} ${args[1]} is already taked`)
          }
        } else {
          msg.channel.send(`${msg.author.username} you have already played`)
        }
        break
      
      case 'r':
      case 'roll':
        if(takes.length >= 2) {
          let random = Math.floor((Math.random() * maxValue));
          let nearest = takes[0]
          for(let i = 1; i < takes.length; i++) {
            if(Math.abs(random - takes[i].value) < Math.abs(random - nearest.value)) {
              nearest = takes[i];
            }
          }
          takes = []
          msg.channel.send(`The number is ${random} and the WINNER IS ${nearest.username}`)
        } else {
          msg.channel.send('I need more than one player to roll')
        }
        break
        
      case 'reset':
        takes = []
        msg.channel.send('The list has been reset')
        break
    }
  }
});

function joinArray(array, index, char = ' ') {
  let res = ''
  for(let i = index; i < array.length; i++) {
    res += array[i] + char
  }
  return res
}

function isInteger(n) {
  return Number.isInteger(parseInt(n))
}

client.login('YOUR TOKEN')
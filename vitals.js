const mqtt = require('mqtt')

const fs = require('fs/promises')

const client = mqtt.connect('mqtt:broker')

client.on('connect', c => { console.log('connect', c); client.subscribe('#', {}, (err, grant) => {
  console.log({ err, grant })
}) })

client.on('reconnect', () => console.log('reconnect'))
client.on('disconnect', () => console.log('disconnect', d))
client.on('close', () => console.log('close'))
client.on('offline', () => console.log('offline'))
client.on('error', e => console.log('error', e))
client.on('end', () => console.log('end'))

client.on('message', (topic, message, packet) => {
  if(topic === '/vitals') { return; }
  console.log({ topic, message, packet})
})


const epoch = Date.now()
setInterval(async () => {

  const temp = await fs.readFile('/sys/class/thermal/thermal_zone0/temp', { encoding: 'utf-8' })
  const tempC = parseInt(temp.trim(), 10) / 1000

  const cur_state = await fs.readFile('/sys/class/thermal/cooling_device0/cur_state', { encoding: 'utf-8' })
  const FAN_STATES = {
    '0': 'Off',
    '1': 'On',
    '2': 'On (high)',
    '3': 'On (max)'
  }
  const fanState = FAN_STATES[cur_state.trim()]

  const snapshot = {
    epoch,
    timestamp: Date.now() - epoch,
    tempC,
    fanState
  }

 client.publish('/vitals', JSON.stringify(snapshot))

}, 5 * 1000)

process.on('SIGTERM', function() {
  console.log('goodbye')
  process.exit(0)
})
